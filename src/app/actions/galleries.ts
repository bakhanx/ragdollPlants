'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { MAX_GALLERY_PHOTOS } from '@/types/models/gallery';
import {
  getCurrentUser,
  requireAuth,
  validateGalleryOwnership
} from '@/lib/auth-utils';
import {
  uploadImageToCloudflare,
  deleteImageFromCloudflare
} from '@/lib/cloudflare-images';
import type { Prisma } from '@prisma/client';
import { populateLikeInfo } from './likes';
import { DEMO_GALLERIES_RESPONSE } from '@/app/_constants/demoData';
import { CacheTags } from '@/lib/cache/cacheTags';
import {
  revalidateUserCache,
  revalidateGalleryUpdate
} from '@/lib/cache/cacheInvalidation';
import {
  GalleriesResponse,
  PublicGalleriesResponse
} from '@/types/cache/gallery';
import { galleryForCache } from '@/app/_utils/dateUtils';
import { unstable_cache } from 'next/cache';

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

// 갤러리 목록 조회 내부 구현
async function getGalleriesInternal(
  userId?: string
): Promise<PublicGalleriesResponse> {
  const currentUser = await getCurrentUser();

  const where: Prisma.GalleryWhereInput = {
    isActive: true
  };

  if (userId) {
    where.authorId = userId;
    // 다른 사람의 갤러리를 볼 때는 비공개 갤러리 제외
    if (currentUser?.id !== userId) {
      where.isPublic = true;
    }
  } else {
    // 갤러리 메인 페이지에서는 공개된 것만
    where.isPublic = true;
  }

  const galleries = await prisma.gallery.findMany({
    where,
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
    },
    orderBy: [
      { isFeatured: 'desc' },
      { displayOrder: 'asc' },
      { createdAt: 'desc' }
    ]
  });

  const galleriesWithLikes = await populateLikeInfo(
    galleries,
    'gallery',
    currentUser?.id
  );

  // 캐시용 데이터로 변환
  return galleriesWithLikes.map(galleryForCache);
}

// 캐시된 갤러리 목록 조회
function getCachedGalleries(userId?: string) {
  const cacheKey = userId ? `galleries-${userId}` : 'galleries-public';
  const tags = userId ? [CacheTags.galleries(userId)] : [CacheTags.allContent];

  return unstable_cache(() => getGalleriesInternal(userId), [cacheKey], {
    tags
  })();
}

// 갤러리 목록 조회
export async function getGalleries(
  userId?: string
): Promise<PublicGalleriesResponse> {
  try {
    return await getCachedGalleries(userId);
  } catch (error) {
    console.error('갤러리 조회 실패:', error);
    return [];
  }
}

// 갤러리 상세 조회
async function getGalleryByIdInternal(id: string) {
  const gallery = await prisma.gallery.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, image: true } },
      plant: { select: { id: true, name: true } }
    }
  });

  if (!gallery || !gallery.isActive) {
    return null;
  }

  return galleryForCache(gallery);
}

// 캐시된 갤러리 상세 조회
function getCachedGalleryById(galleryId: string) {
  return unstable_cache(
    () => getGalleryByIdInternal(galleryId),
    [`gallery-detail-${galleryId}`],
    {
      tags: [CacheTags.gallery(galleryId)]
    }
  )();
}

// 특정 갤러리 상세 정보 조회
export async function getGalleryById(id: string) {
  try {
    const currentUser = await getCurrentUser().catch(() => null);

    // 캐시된 갤러리 기본 정보 조회
    const cachedGallery = await getCachedGalleryById(id);

    if (!cachedGallery) {
      throw new Error('갤러리를 찾을 수 없거나 비활성화된 게시물입니다.');
    }

    // 좋아요 정보는 실시간으로 조회 (캐시x)
    const [likesCount, userLike] = await Promise.all([
      prisma.like.count({
        where: {
          type: 'gallery',
          targetId: id
        }
      }),
      currentUser
        ? prisma.like.findFirst({
            where: {
              userId: currentUser.id,
              type: 'gallery',
              targetId: id
            }
          })
        : Promise.resolve(null)
    ]);

    return {
      ...cachedGallery,
      likes: likesCount,
      isLiked: !!userLike
    };
  } catch (error) {
    console.error('갤러리 조회 오류:', error);
    throw error;
  }
}

// 사용자별 갤러리 조회
async function getUserGalleriesInternal(
  targetUserId: string,
  isOwner: boolean
): Promise<GalleriesResponse> {
  const where: Prisma.GalleryWhereInput = {
    authorId: targetUserId
  };

  if (!isOwner) {
    where.isPublic = true;
    where.isActive = true;
  }

  const galleries = await prisma.gallery.findMany({
    where,
    include: {
      author: { select: { id: true, name: true, image: true } },
      plant: { select: { id: true, name: true } }
    },
    orderBy: [
      { isFeatured: 'desc' }, // 대표 이미지 우선
      { displayOrder: 'asc' }, // 그 다음 순서대로
      { createdAt: 'asc' } // 같은 순서면 오래된 순
    ]
  });

  // 갤러리 ID 목록 추출
  const galleryIds = galleries.map(g => g.id);

  // 좋아요 수
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

  // 갤러리와 좋아요 수 결합 후 캐시용 데이터로 변환
  const galleriesWithLikes = galleries.map(gallery =>
    galleryForCache({
      ...gallery,
      likes: likeCountMap.get(gallery.id) || 0,
      isLiked: false,
      isOwner: isOwner
    })
  );

  return {
    galleries: galleriesWithLikes,
    isOwner
  };
}

// 캐시된 사용자별 갤러리 조회
function getCachedUserGalleries(targetUserId: string, isOwner: boolean) {
  return unstable_cache(
    () => getUserGalleriesInternal(targetUserId, isOwner),
    [`user-galleries-${targetUserId}`, isOwner.toString()],
    {
      tags: [CacheTags.galleries(targetUserId)]
    }
  )();
}

// 사용자별 갤러리 조회
export async function getUserGalleries(
  userId?: string
): Promise<GalleriesResponse> {
  try {
    const session = await getCurrentUser();
    const currentUserId = session?.id;
    const targetUserId = userId || currentUserId;

    // 비로그인 데모 데이터
    if (!targetUserId) {
      return DEMO_GALLERIES_RESPONSE;
    }

    const isOwner = currentUserId === targetUserId;

    return await getCachedUserGalleries(targetUserId, isOwner);
  } catch (error) {
    console.error('사용자 갤러리 조회 오류:', error);
    throw error;
  }
}

// 갤러리 생성
export async function createGallery(formData: FormData) {
  try {
    const user = await requireAuth();

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

    // 유효성 검사 - Zod
    const validatedData = createGallerySchema.parse({
      title,
      description: description || undefined,
      plantId: plantId || undefined,
      plantName: plantName || undefined,
      tags: tags.length > 0 ? tags : undefined
    });

    // 이미지 처리
    let imageUrl = '';
    const imageFile = formData.get('image') as File | null;

    if (imageFile && imageFile.size > 0) {
      // Cloudflare Images에 업로드
      imageUrl = await uploadImageToCloudflare(
        imageFile,
        '/images/plant-default.webp'
      );
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

    // 캐시 무효화
    revalidateUserCache('galleryCreate', user.id);

    return {
      success: true,
      gallery,
      redirectTo: '/galleries'
    };
  } catch (error) {
    console.error('갤러리 생성 오류:', error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: false,
      error: '갤러리 업로드 중 오류가 발생했습니다.'
    };
  }
}

// 갤러리 수정
export async function updateGallery(id: string, formData: FormData) {
  try {
    const user = await requireAuth();

    // 갤러리 존재 여부 및 권한 확인
    await validateGalleryOwnership(id, user.id);

    const title = (formData.get('title') as string)?.trim() || '';
    const description = (formData.get('description') as string)?.trim() || '';
    const plantId = (formData.get('plantId') as string)?.trim() || '';
    const plantName = (formData.get('plantName') as string)?.trim() || '';
    const tags =
      (formData.get('tags') as string)?.split(',').map(tag => tag.trim()) || [];

    // 이미지 처리
    let imageUrl = '';
    const imageFile = formData.get('image') as File | null;

    if (imageFile && imageFile.size > 0) {
      // Cloudflare Images에 업로드
      imageUrl = await uploadImageToCloudflare(
        imageFile,
        '/images/plant-default.webp'
      );
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
      tags: string[];
      image?: string;
    } = {
      title: validatedData.title,
      description: validatedData.description || null,
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

    // 캐시 무효화
    revalidateGalleryUpdate(user.id, id);

    return {
      success: true,
      gallery,
      redirectTo: '/galleries'
    };
  } catch (error) {
    console.error('갤러리 수정 오류:', error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: false,
      error: '갤러리 수정 중 오류가 발생했습니다.'
    };
  }
}

// 갤러리 삭제
export async function deleteGallery(id: string) {
  try {
    const user = await requireAuth();

    // 갤러리 존재 여부 및 권한 확인
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

    // 이미지 파일 삭제
    if (
      existingGallery.image &&
      !existingGallery.image.includes('/images/plant-default.webp') &&
      !existingGallery.image.startsWith('data:')
    ) {
      await deleteImageFromCloudflare(existingGallery.image);
    }

    // 캐시 무효화
    revalidateUserCache('galleryCreate', user.id);

    console.log('갤러리 삭제 완료:', { id, title: existingGallery.title });

    // 성공 결과 반환
    return {
      success: true,
      redirectTo: '/galleries'
    };
  } catch (error) {
    console.error('갤러리 삭제 오류:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : '갤러리 삭제에 실패했습니다'
    };
  }
}

// 대표 이미지 설정
export async function setFeaturedGallery(itemId: string) {
  try {
    const user = await requireAuth();

    // 갤러리 존재 여부 및 권한 확인
    await validateGalleryOwnership(itemId, user.id);

    // 트랜잭션으로 대표 이미지 설정
    await prisma.$transaction(async tx => {
      // 기존 대표 이미지들 해제 (같은 사용자의 모든 갤러리)
      await tx.gallery.updateMany({
        where: {
          authorId: user.id,
          isFeatured: true
        },
        data: { isFeatured: false }
      });

      // 선택한 갤러리를 대표 이미지로 설정
      await tx.gallery.update({
        where: { id: itemId },
        data: {
          isFeatured: true,
          displayOrder: 0 // 대표 이미지는 항상 맨 앞
        }
      });

      // 나머지 갤러리들의 순서 재정렬
      const otherGalleries = await tx.gallery.findMany({
        where: {
          authorId: user.id,
          id: { not: itemId }
        },
        orderBy: { displayOrder: 'asc' }
      });

      // 나머지 갤러리들의 순서를 1부터 시작하도록 업데이트
      await Promise.all(
        otherGalleries.map((gallery, index) =>
          tx.gallery.update({
            where: { id: gallery.id },
            data: { displayOrder: index + 1 }
          })
        )
      );
    });

    // 캐시 무효화
    revalidateUserCache('galleryCreate', user.id);

    return {
      success: true,
      message: '대표 작품으로 설정되었습니다.'
    };
  } catch (error) {
    console.error('대표 이미지 설정 오류:', error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('대표 이미지 설정 중 오류가 발생했습니다.');
  }
}

// 갤러리 순서 저장
export async function updateGalleriesOrder(
  galleryOrder: { id: string; order: number }[]
) {
  try {
    const user = await requireAuth();

    // 트랜잭션으로 순서 업데이트
    await prisma.$transaction(async tx => {
      await Promise.all(
        galleryOrder.map(({ id, order }) =>
          tx.gallery.update({
            where: {
              id,
              authorId: user.id
            },
            data: { displayOrder: order }
          })
        )
      );
    });

    // 캐시 무효화
    revalidateUserCache('galleryCreate', user.id);

    return {
      success: true,
      message: '갤러리 순서가 저장되었습니다.'
    };
  } catch (error) {
    console.error('갤러리 순서 저장 오류:', error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('갤러리 순서 저장 중 오류가 발생했습니다.');
  }
}
