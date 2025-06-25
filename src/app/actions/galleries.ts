'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { GalleryCreateInput, MAX_GALLERY_PHOTOS } from '@/types/models/gallery';
import { getCurrentUser, validateGalleryOwnership } from './utils/auth-helpers';
import { uploadImageToCloudflare, deleteImageFromCloudflare } from '@/lib/cloudflare-images';

// 갤러리 생성 유효성 검사 스키마
const createGallerySchema = z.object({
  title: z
    .string()
    .min(1, '제목은 필수입니다')
    .max(100, '제목은 100자 이하여야 합니다'),
  description: z.string().optional(),
  plantId: z.string().optional(),
  plantName: z.string().optional(),
  tags: z.array(z.string()).optional()
});

// 모든 갤러리 조회 (N+1 쿼리 최적화 직접 구현)
export async function getGalleries() {
  try {
    // 갤러리 목록 조회
    const galleries = await prisma.gallery.findMany({
      select: {
        id: true,
        title: true,
        image: true,
        description: true,
        createdAt: true,
        plantId: true,
        tags: true,
        author: { select: { id: true, name: true, image: true } },
        plant: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    // 갤러리 ID 목록 추출
    const galleryIds = galleries.map(g => g.id);

    // 좋아요 수를 한 번의 쿼리로 조회 (N+1 쿼리 해결)
    const likeCounts = await prisma.like.groupBy({
      by: ['targetId'],
      where: {
        type: 'gallery',
        targetId: { in: galleryIds }
      },
      _count: { _all: true }
    });

    // 좋아요 수 맵 생성
    const likeCountMap = new Map(
      likeCounts.map(item => [item.targetId, item._count._all])
    );

    // 갤러리와 좋아요 수 결합
    return galleries.map(gallery => ({
      ...gallery,
      likes: likeCountMap.get(gallery.id) || 0
    }));
  } catch (error) {
    console.error('갤러리 목록 조회 오류:', error);
    throw new Error('갤러리 목록을 불러오는 중 오류가 발생했습니다.');
  }
}

// 특정 갤러리 조회 (최적화 직접 구현)
export async function getGalleryById(id: string) {
  try {
    const gallery = await prisma.gallery.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, image: true } },
        plant: { select: { id: true, name: true } }
      }
    });

    if (!gallery) {
      throw new Error('갤러리를 찾을 수 없습니다.');
    }

    // 좋아요 수 조회
    const likesCount = await prisma.like.count({
      where: {
        type: 'gallery',
        targetId: id
      }
    });

    return {
      ...gallery,
      likes: likesCount
    };
  } catch (error) {
    console.error('갤러리 조회 오류:', error);
    throw error;
  }
}

// 사용자별 갤러리 조회 (최적화 직접 구현)
export async function getUserGalleries(userId?: string) {
  try {
    const session = await auth();
    const targetUserId = userId || session?.user?.id;

    if (!targetUserId) {
      throw new Error('로그인이 필요합니다.');
    }

    // 사용자 갤러리 목록 조회
    const galleries = await prisma.gallery.findMany({
      where: { authorId: targetUserId },
      select: {
        id: true,
        title: true,
        image: true,
        description: true,
        createdAt: true,
        plantId: true,
        tags: true,
        author: { select: { id: true, name: true, image: true } },
        plant: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    // 갤러리 ID 목록 추출
    const galleryIds = galleries.map(g => g.id);

    // 좋아요 수를 한 번의 쿼리로 조회 (N+1 쿼리 해결)
    const likeCounts = await prisma.like.groupBy({
      by: ['targetId'],
      where: {
        type: 'gallery',
        targetId: { in: galleryIds }
      },
      _count: { _all: true }
    });

    // 좋아요 수 맵 생성
    const likeCountMap = new Map(
      likeCounts.map(item => [item.targetId, item._count._all])
    );

    // 갤러리와 좋아요 수 결합
    return galleries.map(gallery => ({
      ...gallery,
      likes: likeCountMap.get(gallery.id) || 0
    }));
  } catch (error) {
    console.error('사용자 갤러리 조회 오류:', error);
    throw error;
  }
}

// 갤러리 생성 (업로드) - 최적화 적용
export async function createGallery(formData: FormData) {
  try {
    const user = await getCurrentUser();

    // 사용자의 현재 갤러리 개수 확인
    const currentCount = await prisma.gallery.count({
      where: {
        authorId: user.id
      }
    });

    if (currentCount >= MAX_GALLERY_PHOTOS) {
      throw new Error(
        `갤러리는 최대 ${MAX_GALLERY_PHOTOS}개까지만 등록할 수 있습니다.`
      );
    }

    // FormData에서 데이터 추출 - 직접 처리
    const title = (formData.get('title') as string)?.trim() || '';
    const description = (formData.get('description') as string)?.trim() || '';
    const plantId = (formData.get('plantId') as string)?.trim() || '';
    const plantName = (formData.get('plantName') as string)?.trim() || '';

    // 태그 처리
    const tagsJson = formData.get('tags') as string;
    let tags: string[] = [];
    if (tagsJson?.trim()) {
      try {
        const parsedTags = JSON.parse(tagsJson);
        if (Array.isArray(parsedTags)) {
          tags = parsedTags
            .filter(tag => tag && typeof tag === 'string' && tag.trim())
            .slice(0, 20);
        }
      } catch (e) {
        console.error('태그 파싱 오류:', e);
        tags = [];
      }
    }

    // 유효성 검사 - Zod가 모든 검증 담당
    const validatedData = createGallerySchema.parse({
      title,
      description: description || undefined,
      plantId: plantId || undefined,
      plantName: plantName || undefined,
      tags: tags.length > 0 ? tags : undefined
    });

    // 이미지 처리 - Cloudflare Images 업로드
    let imageUrl = '';
    const imageFile = formData.get('image') as File | null;

    if (imageFile && imageFile.size > 0) {
      // Cloudflare Images에 업로드
      imageUrl = await uploadImageToCloudflare(imageFile, '/images/plant-default.png');
    }

    // 갤러리 생성
    const gallery = await prisma.gallery.create({
      data: {
        title: validatedData.title,
        description: validatedData.description || null,
        image: imageUrl,
        plantId: validatedData.plantId || null,
        tags: validatedData.tags || [],
        authorId: user.id
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        plant: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // 갤러리 페이지 재검증
    revalidatePath('/galleries');

    return {
      success: true,
      gallery
    };
  } catch (error) {
    console.error('갤러리 생성 오류:', error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('갤러리 업로드 중 오류가 발생했습니다.');
  }
}

// 갤러리 수정 - 최적화 적용
export async function updateGallery(id: string, formData: FormData) {
  try {
    const user = await getCurrentUser();

    // 갤러리 존재 여부 및 권한 확인 (최적화된 함수 사용)
    await validateGalleryOwnership(id, user.id);

    // FormData에서 데이터 추출 (최적화된 함수 사용)
    const title = (formData.get('title') as string)?.trim() || '';
    const description = (formData.get('description') as string)?.trim() || '';
    const plantId = (formData.get('plantId') as string)?.trim() || '';
    const plantName = (formData.get('plantName') as string)?.trim() || '';
    const tags =
      (formData.get('tags') as string)?.split(',').map(tag => tag.trim()) || [];

    // 이미지 처리 - Cloudflare Images 업로드
    let imageUrl = '';
    const imageFile = formData.get('image') as File | null;

    if (imageFile && imageFile.size > 0) {
      // Cloudflare Images에 업로드
      imageUrl = await uploadImageToCloudflare(imageFile, '/images/plant-default.png');
    }

    // 입력 검증
    const validationResult = createGallerySchema.safeParse({
      title,
      description: description || undefined,
      plantId: plantId || undefined,
      plantName: plantName || undefined,
      tags: tags.length > 0 ? tags : undefined
    });

    if (!validationResult.success) {
      const errors = validationResult.error.errors
        .map(err => err.message)
        .join(', ');
      throw new Error(errors);
    }

    const validatedData = validationResult.data;

    // 갤러리 수정
    const updateData: {
      title: string;
      description: string | null;
      plantId: string | null;
      plantName: string | null;
      tags: string[];
      image?: string;
    } = {
      title: validatedData.title,
      description: validatedData.description || null,
      plantId: validatedData.plantId || null,
      plantName: validatedData.plantName || null,
      tags: validatedData.tags || []
    };

    if (imageUrl) {
      updateData.image = imageUrl;
    }

    const gallery = await prisma.gallery.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        plant: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // 갤러리 페이지 재검증
    revalidatePath('/galleries');
    revalidatePath(`/galleries/${id}`);

    return {
      success: true,
      gallery
    };
  } catch (error) {
    console.error('갤러리 수정 오류:', error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('갤러리 수정 중 오류가 발생했습니다.');
  }
}

// 갤러리 삭제 - 최적화 적용
export async function deleteGallery(id: string) {
  try {
    const user = await getCurrentUser();

    // 갤러리 존재 여부 및 권한 확인 (최적화된 함수 사용)
    const existingGallery = await validateGalleryOwnership(id, user.id);

    // 관련 좋아요 먼저 삭제
    await prisma.like.deleteMany({
      where: {
        type: 'gallery',
        targetId: id
      }
    });

    // 갤러리 삭제
    await prisma.gallery.delete({
      where: { id }
    });

    // 이미지 파일도 삭제 (Cloudflare Images에서)
    if (existingGallery.image && !existingGallery.image.includes('/images/plant-default.png')) {
      await deleteImageFromCloudflare(existingGallery.image);
    }

    // 갤러리 페이지 재검증
    revalidatePath('/galleries');

    return {
      success: true,
      message: `"${existingGallery.title}" 갤러리가 삭제되었습니다.`
    };
  } catch (error) {
    console.error('갤러리 삭제 오류:', error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('갤러리 삭제 중 오류가 발생했습니다.');
  }
}

// 갤러리 좋아요 토글 - 최적화 적용
export async function toggleGalleryLike(id: string) {
  try {
    const user = await getCurrentUser();

    // 갤러리 존재 여부 확인
    const gallery = await prisma.gallery.findUnique({
      where: { id },
      select: {
        id: true
      }
    });

    if (!gallery) {
      throw new Error('갤러리를 찾을 수 없습니다.');
    }

    // 좋아요 상태 확인
    const existingLike = await prisma.like.findFirst({
      where: {
        type: 'gallery',
        targetId: id,
        userId: user.id
      }
    });

    if (existingLike) {
      // 좋아요 취소
      await prisma.like.delete({
        where: {
          id: existingLike.id
        }
      });
    } else {
      // 좋아요 추가
      await prisma.like.create({
        data: {
          type: 'gallery',
          targetId: id,
          userId: user.id
        }
      });
    }

    // 새로운 좋아요 수 조회
    const newLikesCount = await prisma.like.count({
      where: {
        type: 'gallery',
        targetId: id
      }
    });

    // 갤러리 페이지 재검증
    revalidatePath('/galleries');
    revalidatePath(`/galleries/${id}`);

    return {
      success: true,
      likes: newLikesCount,
      isLiked: !existingLike
    };
  } catch (error) {
    console.error('갤러리 좋아요 토글 오류:', error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('좋아요 처리 중 오류가 발생했습니다.');
  }
}
