'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { DiaryMoodStatus } from '@/types/models/diary';
import { getCurrentUser, validateDiaryOwnership } from '@/lib/auth-utils';

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
      ...searchCondition
    };

    // 다이어리 목록과 총 개수를 병렬로 조회
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

    const totalPages = Math.ceil(totalCount / limit);

    return {
      diaries,
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
    const [diary, currentUser] = await Promise.all([
      prisma.diary.findUnique({
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
      }),
      getCurrentUser().catch(() => null) // 로그인하지 않은 경우 null 반환
    ]);

    if (!diary) {
      throw new Error('다이어리를 찾을 수 없습니다.');
    }

    // 작성자와 현재 사용자가 같은지 확인
    const isOwner = currentUser?.id === diary.author?.id;

    return {
      diary,
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
    const session = await auth();
    const targetUserId = userId || session?.user?.id;

    if (!targetUserId) {
      throw new Error('로그인이 필요합니다.');
    }

    const diaries = await prisma.diary.findMany({
      where: {
        authorId: targetUserId
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
      }
    });

    return diaries;
  } catch (error) {
    console.error('사용자 다이어리 조회 오류:', error);
    throw error;
  }
}

// 다이어리 생성
export async function createDiary(formData: FormData) {
  try {
    const user = await getCurrentUser();

    // FormData에서 데이터 추출
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

    // 이미지 파일 처리
    const imageFile = formData.get('image') as File | null;
    let imageUrl = '';

    if (imageFile && imageFile.size > 0) {
      // 실제 구현에서는 파일 스토리지에 업로드
      // 임시로 base64 인코딩 (실제 운영에서는 Cloudflare Images 등 사용 권장)
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      imageUrl = `data:${imageFile.type};base64,${base64}`;
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

    // 생성된 다이어리 페이지로 리다이렉트
    redirect(`/diaries/${diary.id}`);
  } catch (error) {
    console.error('다이어리 생성 오류:', error);
    throw error;
  }
}

// 다이어리 수정
export async function updateDiary(id: string, formData: FormData) {
  try {
    const user = await getCurrentUser();

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

    // 이미지 파일 처리
    const imageFile = formData.get('image') as File | null;
    const existingImage = formData.get('existingImage') as string | null;
    let imageUrl: string | undefined = undefined;

    if (imageFile && imageFile.size > 0) {
      // 새로운 이미지 파일이 업로드된 경우
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      imageUrl = `data:${imageFile.type};base64,${base64}`;
    } else if (existingImage) {
      // 기존 이미지를 유지하는 경우
      imageUrl = existingImage;
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

    // 수정된 다이어리 페이지로 리다이렉트
    redirect(`/diaries/${id}`);
  } catch (error) {
    console.error('다이어리 수정 오류:', error);
    throw error;
  }
}

// 다이어리 삭제
export async function deleteDiary(id: string) {
  try {
    const user = await getCurrentUser();

    // 기존 다이어리 확인 및 권한 체크
    const existingDiary = await validateDiaryOwnership(id, user.id);

    // 다이어리 삭제
    await prisma.diary.delete({
      where: { id }
    });

    console.log('다이어리 삭제 완료:', { id });

    // 캐시 재검증
    revalidatePath('/diaries');

    // 다이어리 목록으로 리다이렉트
    redirect('/diaries');
  } catch (error) {
    console.error('다이어리 삭제 오류:', error);
    throw error;
  }
}

// 식물별 다이어리 조회 (최근 3개로 제한)
export async function getDiariesByPlant(plantId: string) {
  try {
    const diaries = await prisma.diary.findMany({
      where: {
        plantId: plantId
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
    const diaries = await prisma.diary.findMany({
      where: {
        plantId: plantId
      },
      select: {
        id: true,
        title: true,
        content: true,
        date: true
      },
      orderBy: {
        createdAt: 'desc'
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

    if (!diary) {
      throw new Error('다이어리를 찾을 수 없습니다.');
    }

    return diary;
  } catch (error) {
    console.error('다이어리 조회 오류:', error);
    throw error;
  }
}
