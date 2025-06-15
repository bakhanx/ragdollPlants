'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { GalleryCreateInput, MAX_GALLERY_PHOTOS } from '@/types/models/gallery';

// 갤러리 생성 유효성 검사 스키마
const createGallerySchema = z.object({
  title: z.string().min(1, '제목은 필수입니다').max(100, '제목은 100자 이하여야 합니다'),
  description: z.string().optional(),
  plantId: z.string().optional(),
  plantName: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// 모든 갤러리 조회
export async function getGalleries() {
  try {
    const galleries = await prisma.gallery.findMany({
      select: {
        id: true,
        title: true,
        image: true,
        description: true,
        createdAt: true,
        plantId: true,
        tags: true,
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
      orderBy: {
        createdAt: 'desc'
      }
    });

    // 각 갤러리의 좋아요 수 조회
    const galleriesWithLikes = await Promise.all(
      galleries.map(async (gallery) => {
        const likesCount = await prisma.like.count({
          where: {
            type: 'gallery',
            targetId: gallery.id
          }
        });
        
        return {
          ...gallery,
          likes: likesCount
        };
      })
    );

    return galleriesWithLikes;
  } catch (error) {
    console.error('갤러리 목록 조회 오류:', error);
    throw new Error('갤러리 목록을 불러오는 중 오류가 발생했습니다.');
  }
}

// 특정 갤러리 조회
export async function getGalleryById(id: string) {
  try {
    const gallery = await prisma.gallery.findUnique({
      where: { id },
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

// 사용자별 갤러리 조회
export async function getUserGalleries(userId?: string) {
  try {
    const session = await auth();
    const targetUserId = userId || session?.user?.id;
    
    if (!targetUserId) {
      throw new Error('로그인이 필요합니다.');
    }

    const galleries = await prisma.gallery.findMany({
      where: {
        authorId: targetUserId
      },
      select: {
        id: true,
        title: true,
        image: true,
        description: true,
        createdAt: true,
        plantId: true,
        tags: true,
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
      orderBy: {
        createdAt: 'desc'
      }
    });

    // 각 갤러리의 좋아요 수 조회
    const galleriesWithLikes = await Promise.all(
      galleries.map(async (gallery) => {
        const likesCount = await prisma.like.count({
          where: {
            type: 'gallery',
            targetId: gallery.id
          }
        });
        
        return {
          ...gallery,
          likes: likesCount
        };
      })
    );

    return galleriesWithLikes;
  } catch (error) {
    console.error('사용자 갤러리 조회 오류:', error);
    throw error;
  }
}

// 갤러리 생성 (업로드)
export async function createGallery(formData: FormData) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error('로그인이 필요합니다.');
    }

    // 사용자의 현재 갤러리 개수 확인
    const currentCount = await prisma.gallery.count({
      where: {
        authorId: session.user.id
      }
    });

    if (currentCount >= MAX_GALLERY_PHOTOS) {
      throw new Error(`갤러리는 최대 ${MAX_GALLERY_PHOTOS}개까지만 등록할 수 있습니다.`);
    }

    // FormData에서 데이터 추출
    const rawData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      plantId: formData.get('plantId') as string,
      plantName: formData.get('plantName') as string,
    };

    // 태그 처리
    const tagsJson = formData.get('tags') as string;
    let tags: string[] = [];
    if (tagsJson) {
      try {
        tags = JSON.parse(tagsJson);
      } catch (e) {
        console.error('태그 파싱 오류:', e);
      }
    }

    // 이미지 파일 처리
    const imageFile = formData.get('image') as File | null;
    let imageUrl = '';
    
    if (!imageFile || imageFile.size === 0) {
      throw new Error('이미지는 필수입니다.');
    }

    // 파일 크기 검증 (5MB 제한)
    if (imageFile.size > 5 * 1024 * 1024) {
      throw new Error('이미지 파일 크기는 5MB 이하여야 합니다.');
    }

    // 이미지 타입 검증
    if (!imageFile.type.startsWith('image/')) {
      throw new Error('이미지 파일만 업로드할 수 있습니다.');
    }

    // 실제 구현에서는 파일 스토리지에 업로드
    // 임시로 base64 인코딩 (실제 운영에서는 Cloudflare Images 등 사용 권장)
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    imageUrl = `data:${imageFile.type};base64,${base64}`;

    // 입력 검증
    const validationResult = createGallerySchema.safeParse({
      ...rawData,
      tags
    });
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => err.message).join(', ');
      throw new Error(errors);
    }

    const validatedData = validationResult.data;

    // 갤러리 생성
    const gallery = await prisma.gallery.create({
      data: {
        title: validatedData.title,
        description: validatedData.description || null,
        image: imageUrl,
        plantId: validatedData.plantId || null,
        tags: validatedData.tags || [],
        authorId: session.user.id,
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

// 갤러리 수정
export async function updateGallery(id: string, formData: FormData) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error('로그인이 필요합니다.');
    }

    // 갤러리 존재 여부 및 권한 확인
    const existingGallery = await prisma.gallery.findUnique({
      where: { id },
      select: {
        id: true,
        authorId: true
      }
    });

    if (!existingGallery) {
      throw new Error('갤러리를 찾을 수 없습니다.');
    }

    if (existingGallery.authorId !== session.user.id) {
      throw new Error('갤러리를 수정할 권한이 없습니다.');
    }

    // FormData에서 데이터 추출
    const rawData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      plantId: formData.get('plantId') as string,
      plantName: formData.get('plantName') as string,
    };

    const tagsJson = formData.get('tags') as string;
    let tags: string[] = [];
    if (tagsJson) {
      try {
        tags = JSON.parse(tagsJson);
      } catch (e) {
        console.error('태그 파싱 오류:', e);
      }
    }

    // 새 이미지 파일 처리 (선택사항)
    const imageFile = formData.get('image') as File | null;
    let imageUrl: string | undefined;
    
    if (imageFile && imageFile.size > 0) {
      // 파일 크기 검증 (5MB 제한)
      if (imageFile.size > 5 * 1024 * 1024) {
        throw new Error('이미지 파일 크기는 5MB 이하여야 합니다.');
      }

      // 이미지 타입 검증
      if (!imageFile.type.startsWith('image/')) {
        throw new Error('이미지 파일만 업로드할 수 있습니다.');
      }

      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      imageUrl = `data:${imageFile.type};base64,${base64}`;
    }

    // 입력 검증
    const validationResult = createGallerySchema.safeParse({
      ...rawData,
      tags
    });
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => err.message).join(', ');
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
      tags: validatedData.tags || [],
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

// 갤러리 삭제
export async function deleteGallery(id: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error('로그인이 필요합니다.');
    }

    // 갤러리 존재 여부 및 권한 확인
    const existingGallery = await prisma.gallery.findUnique({
      where: { id },
      select: {
        id: true,
        authorId: true,
        title: true
      }
    });

    if (!existingGallery) {
      throw new Error('갤러리를 찾을 수 없습니다.');
    }

    if (existingGallery.authorId !== session.user.id) {
      throw new Error('갤러리를 삭제할 권한이 없습니다.');
    }

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

// 갤러리 좋아요 토글
export async function toggleGalleryLike(id: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error('로그인이 필요합니다.');
    }

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
        userId: session.user.id
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
          userId: session.user.id
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