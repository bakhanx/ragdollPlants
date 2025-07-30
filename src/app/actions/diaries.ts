'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { DiaryMoodStatus } from '@/types/models/diary';
import { getCurrentUser, validateDiaryOwnership } from '@/lib/auth-utils';
import { Prisma } from '@prisma/client';
import { populateLikeInfo } from './likes';
import {
  uploadImageToCloudflare,
  deleteImageFromCloudflare
} from '@/lib/cloudflare-images';
import { DEMO_DIARIES_RESPONSE } from '@/app/_constants/demoData';

// 다이어리 생성 유효성 검사 스키마
const createDiarySchema = z.object({
  title: z.string().min(1, '제목은 필수입니다'),
  content: z.string().min(1, '내용은 필수입니다'),
  status: z.enum(['good', 'normal', 'bad']),
  date: z.string().optional(),
  plantId: z.string().optional(),
  tags: z.array(z.string()).optional()
});



// 모든 다이어리 조회 (현재 사용자의 다이어리만)
export async function getDiaries(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  try {
    const user = await getCurrentUser();
    
    // 비로그인 데모 데이터
    if (!user) {
      return DEMO_DIARIES_RESPONSE;
    }
    const page = params?.page || 1;
    const limit = params?.limit || 4;
    const search = params?.search?.trim();
    const skip = (page - 1) * limit;

    // 검색 조건 설정
    const searchCondition = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' as const } },
            { content: { contains: search, mode: 'insensitive' as const } }
          ]
        }
      : {};

    const whereCondition = {
      authorId: user.id,
      isActive: true,
      ...searchCondition
    };

    // 다이어리 목록, 총 개수 병렬 조회
    const [diaries, totalCount] = await Promise.all([
      prisma.diary.findMany({
        where: whereCondition,
        select: {
          id: true,
          title: true,
          content: true,
          image: true,
          status: true,
          date: true,
          plantId: true,
          tags: true,
          createdAt: true,
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
        },
        skip,
        take: limit
      }),
      prisma.diary.count({
        where: whereCondition
      })
    ]);

    const diariesWithLikes = await populateLikeInfo(diaries, 'diary', user.id);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      diaries: diariesWithLikes,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };
  } catch (error) {
    console.error('다이어리 목록 조회 오류:', error);
    throw new Error('다이어리 목록을 불러오는 중 오류가 발생했습니다.');
  }
}

// 다이어리 조회 및 작성자 확인
export async function getDiaryWithOwnership(id: string) {
  try {
    const currentUser = await getCurrentUser().catch(() => null);

    const diary = await prisma.diary.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    if (!diary || !diary.isActive) {
      throw new Error('다이어리를 찾을 수 없거나 비활성화된 게시물입니다.');
    }

    // 좋아요 정보 조회
    const [likesCount, userLike] = await Promise.all([
      prisma.like.count({
        where: { type: 'diary', targetId: id }
      }),
      currentUser
        ? prisma.like.findFirst({
            where: {
              userId: currentUser.id,
              type: 'diary',
              targetId: id
            }
          })
        : Promise.resolve(null)
    ]);

    // 작성자와 현재 사용자가 같은지 확인
    const isOwner = currentUser?.id === diary.author?.id;

    return {
      diary: {
        ...diary,
        likes: likesCount,
        isLiked: !!userLike
      },
      isOwner
    };
  } catch (error) {
    console.error('다이어리 조회 오류:', error);
    throw error;
  }
}

// 사용자별 다이어리 조회
export async function getUserDiaries(userId?: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return null;
    }
    const targetUserId = userId || currentUser?.id;

    if (!targetUserId) {
      throw new Error('사용자 ID를 찾을 수 없습니다.');
    }

    const isOwner = currentUser?.id === targetUserId;

    const where: Prisma.DiaryWhereInput = {
      authorId: targetUserId
    };

    if (!isOwner) {
      where.isPublic = true;
      where.isActive = true;
    }

    const diaries = await prisma.diary.findMany({
      where,
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        status: true,
        date: true,
        plantId: true,
        tags: true,
        createdAt: true,
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

    if (diaries.length === 0) {
      return [];
    }

    return await populateLikeInfo(diaries, 'diary', currentUser?.id);
  } catch (error) {
    console.error('사용자 다이어리 조회 오류:', error);
    throw error;
  }
}

// 다이어리 생성
export async function createDiary(formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return null;
    }
    const rawData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      status: formData.get('status') as DiaryMoodStatus,
      date: formData.get('date') as string,
      plantId: formData.get('plantId') as string
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

    // 이미지 파일 처리 - Cloudflare Images 업로드
    let imageUrl = '';
    const imageFile = formData.get('image') as File | null;

    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImageToCloudflare(
        imageFile,
        '/images/plant-default.webp'
      );
    }

    // 입력 검증
    const validationResult = createDiarySchema.safeParse({
      ...rawData,
      tags
    });

    if (!validationResult.success) {
      const errors = validationResult.error.errors
        .map(err => err.message)
        .join(', ');
      throw new Error(errors);
    }

    const validatedData = validationResult.data;

    // 다이어리 생성
    const diary = await prisma.diary.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        status: validatedData.status,
        date: validatedData.date ? new Date(validatedData.date) : new Date(),
        image: imageUrl || null,
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
        }
      }
    });

    console.log('다이어리 생성 완료:', { id: diary.id, title: diary.title });

    // 캐시 재검증
    revalidatePath('/diaries');

    // 성공 결과 반환
    return {
      success: true,
      diaryId: diary.id,
      redirectTo: `/diaries/${diary.id}`
    };
  } catch (error) {
    console.error('다이어리 생성 오류:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : '다이어리 생성에 실패했습니다'
    };
  }
}

// 다이어리 수정
export async function updateDiary(id: string, formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return null;
    }
    // 기존 다이어리 확인 및 권한 체크
    const existingDiary = await validateDiaryOwnership(id, user.id);

    // FormData에서 데이터 추출
    const rawData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      status: formData.get('status') as DiaryMoodStatus,
      date: formData.get('date') as string,
      plantId: formData.get('plantId') as string
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

    // 이미지 파일 처리 - Cloudflare Images 업로드
    const imageFile = formData.get('image') as File | null;
    let imageUrl: string | undefined = undefined;

    if (imageFile && imageFile.size > 0) {
      // 새로운 이미지 파일이 업로드된 경우
      imageUrl = await uploadImageToCloudflare(
        imageFile,
        '/images/plant-default.webp'
      );

      // 기존 이미지가 있고 기본 이미지가 아닌 경우 삭제
      if (
        existingDiary.image &&
        !existingDiary.image.includes('/images/plant-default.webp') &&
        !existingDiary.image.startsWith('data:')
      ) {
        await deleteImageFromCloudflare(existingDiary.image);
      }
    }

    // 입력 검증
    const validationResult = createDiarySchema.safeParse({
      ...rawData,
      tags
    });

    if (!validationResult.success) {
      const errors = validationResult.error.errors
        .map(err => err.message)
        .join(', ');
      throw new Error(errors);
    }

    const validatedData = validationResult.data;

    // 다이어리 업데이트 데이터 구성
    const updateData: {
      title: string;
      content: string;
      status: string;
      date?: Date;
      plantId: string | null;
      tags: string[];
      image?: string;
    } = {
      title: validatedData.title,
      content: validatedData.content,
      status: validatedData.status,
      plantId: validatedData.plantId || null,
      tags: validatedData.tags || []
    };

    // 날짜가 있는 경우만 업데이트
    if (validatedData.date) {
      updateData.date = new Date(validatedData.date);
    }

    // 이미지가 있는 경우만 업데이트
    if (imageUrl) {
      updateData.image = imageUrl;
    }

    const updatedDiary = await prisma.diary.update({
      where: { id },
      data: updateData
    });

    console.log('다이어리 수정 완료:', {
      id: updatedDiary.id,
      title: updatedDiary.title
    });

    // 캐시 재검증
    revalidatePath('/diaries');
    revalidatePath(`/diaries/${id}`);

    // 성공 결과 반환
    return {
      success: true,
      diaryId: id,
      redirectTo: `/diaries/${id}`
    };
  } catch (error) {
    console.error('다이어리 수정 오류:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : '다이어리 수정에 실패했습니다'
    };
  }
}

// 다이어리 삭제
export async function deleteDiary(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return null;
    }
    // 기존 다이어리 확인 및 권한 체크
    const existingDiary = await validateDiaryOwnership(id, user.id);

    // 관련 좋아요 먼저 삭제
    await prisma.like.deleteMany({
      where: {
        type: 'diary',
        targetId: id
      }
    });

    // 다이어리 삭제
    await prisma.diary.delete({
      where: { id }
    });

    // 이미지 파일도 삭제 (Cloudflare Images에서)
    if (
      existingDiary.image &&
      !existingDiary.image.includes('/images/plant-default.webp') &&
      !existingDiary.image.startsWith('data:')
    ) {
      await deleteImageFromCloudflare(existingDiary.image);
    }

    console.log('다이어리 삭제 완료:', { id, title: existingDiary.title });

    // 캐시 재검증
    revalidatePath('/diaries');

    // 성공 결과 반환
    return {
      success: true,
      redirectTo: '/diaries'
    };
  } catch (error) {
    console.error('다이어리 삭제 오류:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : '다이어리 삭제에 실패했습니다'
    };
  }
}

// 식물별 다이어리 조회 (최근 3개로 제한)
export async function getDiariesByPlant(plantId: string) {
  try {
    const diaries = await prisma.diary.findMany({
      where: {
        plantId: plantId,
        isPublic: true,
        isActive: true
      },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        status: true,
        date: true,
        plantId: true,
        tags: true,
        createdAt: true,
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
      },
      take: 3 // 최근 3개만 조회
    });

    return diaries;
  } catch (error) {
    console.error('식물별 다이어리 조회 오류:', error);
    throw error;
  }
}

// 식물 상세 페이지에서 사용하는 다이어리 조회
export async function getDiariesByMyPlantDetail(plantId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return null;
    }
    const diaries = await prisma.diary.findMany({
      where: {
        plantId: plantId,
        authorId: user.id,
        isActive: true
      },
      orderBy: {
        date: 'desc'
      },
      take: 3 // 최근 3개만 조회
    });

    return diaries;
  } catch (error) {
    console.error('식물별 다이어리 최소 조회 오류:', error);
    throw error;
  }
}

// 특정 다이어리 조회
export async function getDiaryById(id: string) {
  try {
    const currentUser = await getCurrentUser().catch(() => null);

    const diary = await prisma.diary.findUnique({
      where: { id }
    });

    if (!diary || !diary.isActive) {
      return null;
    }

    // 좋아요 정보 조회
    const [likesCount, userLike] = await Promise.all([
      prisma.like.count({
        where: { type: 'diary', targetId: id }
      }),
      currentUser
        ? prisma.like.findFirst({
            where: {
              userId: currentUser.id,
              type: 'diary',
              targetId: id
            }
          })
        : Promise.resolve(null)
    ]);

    return { ...diary, likes: likesCount, isLiked: !!userLike };
  } catch (error) {
    console.error('다이어리 조회 오류:', error);
    return null;
  }
}
