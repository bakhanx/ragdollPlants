'use server';

import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';
import { z } from 'zod';
import { CacheTags } from '@/lib/cache/cacheTags';
import {
  revalidateUserCache,
  revalidatePlantUpdate
} from '@/lib/cache/cacheInvalidation';
import { CachedPlant, PlantsResponse } from '@/types/cache/plant';
import { plantForCache } from '@/app/_utils/cacheUtils';

import { MAX_PLANTS } from '@/types/models/plant';
import {
  getCurrentUser,
  requireAuth,
  validatePlantOwnership,
  checkUserExists
} from '@/lib/auth-utils';
import {
  uploadImageToCloudflare,
  deleteImageFromCloudflare
} from '@/lib/cloudflare-images';
import { populateLikeInfo } from './likes';
import { DEMO_PLANTS_RESPONSE } from '@/app/_constants/demoData';
import { grantExperience } from '@/lib/gamification';
import { DemoService } from '@/services/demoService';

// 식물 생성 유효성 검사 스키마
const createPlantSchema = z.object({
  name: z
    .string()
    .min(1, '식물 이름은 필수입니다')
    .max(50, '식물 이름은 50자 이하여야 합니다'),
  category: z.string().min(1, '식물 종류를 선택해주세요'),
  description: z.string().optional(),
  location: z.string().optional(),
  purchaseDate: z.string().optional(),
  wateringInterval: z.number().min(1).max(365).optional(),
  nutrientInterval: z.number().min(1).max(365).optional()
});

// 캐시된 식물 목록 조회 함수
async function getMyPlantsInternal(
  userId: string,
  params?: {
    page?: number;
    limit?: number;
    search?: string;
  }
): Promise<PlantsResponse> {
  const page = params?.page || 1;
  const limit = params?.limit || 4;
  const search = params?.search?.trim();
  const skip = (page - 1) * limit;

  // 검색 조건 설정
  const searchCondition = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { category: { contains: search, mode: 'insensitive' as const } }
        ]
      }
    : {};

  const whereCondition = {
    authorId: userId,
    ...searchCondition
  };

  // 식물 목록과 총 개수를 병렬로 조회
  const [plants, totalCount] = await Promise.all([
    prisma.plant.findMany({
      where: whereCondition,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    }),
    prisma.plant.count({
      where: whereCondition
    })
  ]);

  const plantsWithLikes = await populateLikeInfo(plants, 'plant', userId);

  // 캐시용 데이터로 변환
  const cachedPlants = plantsWithLikes.map(plant => plantForCache(plant));

  const totalPages = Math.ceil(totalCount / limit);

  return {
    plants: cachedPlants,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  };
}

// 캐시된 식물 목록 조회 함수
function getCachedMyPlants(userId: string, page: number, limit: number) {
  return unstable_cache(
    () => getMyPlantsInternal(userId, { page, limit }),
    [`my-plants-${userId}`, `${page}`, `${limit}`],
    {
      tags: [CacheTags.plants(userId)]
    }
  )();
}

// 내 식물 목록 조회
export async function getMyPlants(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PlantsResponse & { isLoggedIn: boolean; authMismatch?: boolean }> {
  try {
    const user = await getCurrentUser();

    // 비로그인 데모 데이터
    if (!user) {
      return {
        ...DEMO_PLANTS_RESPONSE,
        isLoggedIn: false
      };
    }

    // 세션이 있을 때 DB에서 사용자 존재 여부 확인
    const userExists = await checkUserExists(user.id);

    // 세션은 있지만 DB에 사용자가 없는 경우
    if (!userExists) {
      return {
        ...DEMO_PLANTS_RESPONSE,
        isLoggedIn: false,
        authMismatch: true
      };
    }

    const page = params?.page || 1;
    const limit = params?.limit || 4;

    let plantsResponse: PlantsResponse;

    // 검색이 있는 경우 캐시하지 않음
    if (params?.search?.trim()) {
      plantsResponse = await getMyPlantsInternal(user.id, params);
    } else {
      plantsResponse = await getCachedMyPlants(user.id, page, limit);
    }

    return {
      ...plantsResponse,
      isLoggedIn: true
    };
  } catch (error) {
    console.error('내 식물 목록 조회 오류:', error);
    throw new Error('식물 목록을 불러오는 중 오류가 발생했습니다.');
  }
}

// 캐시된 식물 상세 조회 함수
async function getPlantByIdInternal(
  id: string,
  currentUserId?: string
): Promise<CachedPlant> {
  const plant = await prisma.plant.findUnique({
    where: {
      id
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

  if (!plant) {
    throw new Error('식물을 찾을 수 없습니다.');
  }

  // 접근 제어
  const isOwner = currentUserId === plant.authorId;
  if (!isOwner && (!plant.isPublic || !plant.isActive)) {
    throw new Error('비공개 또는 비활성화된 식물입니다.');
  }

  // 좋아요 정보 조회 (실시간 - 캐시하지 않음)
  const [likesCount, userLike] = await Promise.all([
    prisma.like.count({
      where: { type: 'plant', targetId: id }
    }),
    currentUserId
      ? prisma.like.findFirst({
          where: {
            userId: currentUserId,
            type: 'plant',
            targetId: id
          }
        })
      : Promise.resolve(null)
  ]);

  // 캐시용 데이터로 변환
  const plantWithExtras = {
    ...plant,
    likes: likesCount,
    isLiked: !!userLike,
    isOwner
  };

  return plantForCache(plantWithExtras);
}

// 캐시된 식물 상세 조회 함수 (클로저 활용)
function getCachedPlantById(plantId: string, userId?: string) {
  return unstable_cache(
    () => getPlantByIdInternal(plantId, userId),
    [`plant-detail-${plantId}`, userId || 'anonymous'],
    {
      tags: [CacheTags.plant(plantId)]
    }
  )();
}

// 특정 식물 상세 조회
export async function getPlantById(id: string): Promise<CachedPlant> {
  try {
    // 데모 데이터 처리
    if (DemoService.isDemoId(id)) {
      const demoPlant = DemoService.getDemoPlantDetail(id);
      if (!demoPlant) throw new Error('식물을 찾을 수 없습니다.');
      return demoPlant;
    }

    // 실제 데이터 처리
    const currentUser = await getCurrentUser().catch(() => null);
    return await getCachedPlantById(id, currentUser?.id);
  } catch (error) {
    console.error('식물 조회 오류:', error);
    throw error;
  }
}

// 식물 등록 (업로드)
export async function createPlant(formData: FormData) {
  try {
    const user = await requireAuth();

    // 사용자의 현재 식물 개수 확인
    const currentCount = await prisma.plant.count({
      where: {
        authorId: user.id
      }
    });

    if (currentCount >= MAX_PLANTS) {
      throw new Error(`식물은 최대 ${MAX_PLANTS}개까지만 등록할 수 있습니다.`);
    }

    // 폼 데이터 추출 - 직접 처리
    const plantName = (formData.get('plantName') as string)?.trim() || '';
    const plantType = (formData.get('plantType') as string)?.trim() || '';
    const location = (formData.get('location') as string)?.trim() || '';
    const notes = (formData.get('notes') as string)?.trim() || '';
    const acquiredDateString =
      (formData.get('acquiredDate') as string)?.trim() || '';
    const wateringIntervalString = formData.get('wateringInterval') as string;
    const nutrientIntervalString = formData.get('nutrientInterval') as string;

    // 숫자 변환
    const wateringInterval = wateringIntervalString
      ? parseInt(wateringIntervalString)
      : 7;
    const nutrientInterval = nutrientIntervalString
      ? parseInt(nutrientIntervalString)
      : 30;

    // 유효성 검사 - Zod가 모든 검증 담당
    const validatedData = createPlantSchema.parse({
      name: plantName,
      category: plantType,
      description: notes || undefined,
      location: location || undefined,
      purchaseDate: acquiredDateString || undefined,
      wateringInterval: isNaN(wateringInterval) ? 7 : wateringInterval,
      nutrientInterval: isNaN(nutrientInterval) ? 30 : nutrientInterval
    });

    // 이미지 처리
    let imageUrl = '/images/plant-default.webp';
    const image = formData.get('image') as File | null;

    if (image && image.size > 0) {
      imageUrl = await uploadImageToCloudflare(
        image,
        '/images/plant-default.webp'
      );
    }

    // 식물 정보 저장
    const now = new Date();
    const nextWateringDate = new Date(
      now.getTime() +
        (validatedData.wateringInterval || 7) * 24 * 60 * 60 * 1000
    );
    const nextNutrientDate = new Date(
      now.getTime() +
        (validatedData.nutrientInterval || 30) * 24 * 60 * 60 * 1000
    );

    const plant = await prisma.plant.create({
      data: {
        name: validatedData.name,
        image: imageUrl,
        category: validatedData.category,
        description: validatedData.description,
        location: validatedData.location,
        purchaseDate: validatedData.purchaseDate
          ? new Date(validatedData.purchaseDate)
          : null,
        wateringInterval: validatedData.wateringInterval,
        nutrientInterval: validatedData.nutrientInterval,
        needsWater: false,
        needsNutrient: false,
        lastWateredDate: now,
        nextWateringDate: nextWateringDate,
        lastNutrientDate: now,
        nextNutrientDate: nextNutrientDate,
        authorId: user.id,
        tags: []
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

    // 식물 등록 경험치 부여 (+30)
    await grantExperience(user.id, 'ADD_PLANT', '새로운 식물 등록');

    // 캐시 무효화
    revalidateUserCache('plantCreate', user.id);

    return {
      success: true,
      message: '식물이 성공적으로 등록되었습니다.',
      plant,
      redirectTo: `/myplants/${plant.id}`
    };
  } catch (error) {
    console.error('식물 등록 오류:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message
      };
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : '식물 등록에 실패했습니다.'
    };
  }
}

// 식물 정보 수정
export async function updatePlant(id: string, formData: FormData) {
  try {
    const user = await requireAuth();

    // 기존 식물 확인
    const existingPlant = await validatePlantOwnership(id, user.id);

    const plantName = (formData.get('plantName') as string)?.trim() || '';
    const plantType = (formData.get('plantType') as string)?.trim() || '';
    const location = (formData.get('location') as string)?.trim() || '';
    const notes = (formData.get('notes') as string)?.trim() || '';
    const acquiredDateString =
      (formData.get('acquiredDate') as string)?.trim() || '';
    const wateringIntervalString = formData.get('wateringInterval') as string;
    const nutrientIntervalString = formData.get('nutrientInterval') as string;

    // 숫자 변환
    const wateringInterval = wateringIntervalString
      ? parseInt(wateringIntervalString)
      : existingPlant.wateringInterval;
    const nutrientInterval = nutrientIntervalString
      ? parseInt(nutrientIntervalString)
      : existingPlant.nutrientInterval;

    // 유효성 검사 - Zod
    const validatedData = createPlantSchema.parse({
      name: plantName,
      category: plantType,
      description: notes || undefined,
      location: location || undefined,
      purchaseDate: acquiredDateString || undefined,
      wateringInterval: isNaN(wateringInterval)
        ? existingPlant.wateringInterval
        : wateringInterval,
      nutrientInterval: isNaN(nutrientInterval)
        ? existingPlant.nutrientInterval
        : nutrientInterval
    });

    // 이미지 처리
    let imageUrl = existingPlant.image;
    const image = formData.get('image') as File | null;

    if (image && image.size > 0) {
      // 새 이미지 업로드
      imageUrl = await uploadImageToCloudflare(
        image,
        '/images/plant-default.webp'
      );

      // 기존 이미지 삭제 (기본 이미지가 아닌 경우)
      if (
        existingPlant.image &&
        !existingPlant.image.includes('/images/plant-default.webp') &&
        !existingPlant.image.startsWith('data:')
      ) {
        await deleteImageFromCloudflare(existingPlant.image);
      }
    }

    // 업데이트
    const updatedPlant = await prisma.plant.update({
      where: { id },
      data: {
        name: validatedData.name,
        image: imageUrl,
        category: validatedData.category,
        description: validatedData.description,
        location: validatedData.location,
        purchaseDate: validatedData.purchaseDate
          ? new Date(validatedData.purchaseDate)
          : null,
        wateringInterval: validatedData.wateringInterval,
        nutrientInterval: validatedData.nutrientInterval,
        updatedAt: new Date()
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

    // 캐시 무효화
    revalidatePlantUpdate(user.id, id);

    return {
      success: true,
      message: '식물 정보가 성공적으로 수정되었습니다.',
      plant: updatedPlant,
      redirectTo: `/myplants/${id}`
    };
  } catch (error) {
    console.error('식물 수정 오류:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message
      };
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : '식물 수정에 실패했습니다.'
    };
  }
}

// 식물 삭제
export async function deletePlant(id: string) {
  try {
    const user = await requireAuth();

    // 식물 존재 여부 및 권한 확인
    const existingPlant = await validatePlantOwnership(id, user.id);

    // 연관된 데이터 삭제
    await Promise.all([
      // 관리 기록 삭제
      prisma.careRecord.deleteMany({
        where: { plantId: id }
      }),
      // 다이어리 삭제
      prisma.diary.deleteMany({
        where: { plantId: id }
      }),
      // 갤러리 연결 해제 (삭제가 아닌 null로 업데이트)
      prisma.gallery.updateMany({
        where: { plantId: id },
        data: { plantId: null }
      })
    ]);

    // 식물 삭제
    await prisma.plant.delete({
      where: { id }
    });

    // 이미지 파일도 삭제
    if (
      existingPlant.image &&
      !existingPlant.image.includes('/images/plant-default.webp') &&
      !existingPlant.image.startsWith('data:')
    ) {
      await deleteImageFromCloudflare(existingPlant.image);
    }

    console.log('식물 삭제 완료:', { id, name: existingPlant.name });

    // 캐시 무효화 - 식물 삭제는 plantCreate와 동일한 태그들 무효화
    revalidateUserCache('plantCreate', user.id);

    // 성공 결과 반환
    return {
      success: true,
      redirectTo: '/myplants'
    };
  } catch (error) {
    console.error('식물 삭제 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '식물 삭제에 실패했습니다'
    };
  }
}

// 물주기 기록
export async function updateWatering(id: string) {
  try {
    const user = await requireAuth();

    const plant = await validatePlantOwnership(id, user.id);

    // 물주기 기록 업데이트
    const now = new Date();
    const nextWateringDate = new Date(
      now.getTime() + (plant.wateringInterval || 7) * 24 * 60 * 60 * 1000
    );

    const updatedPlant = await prisma.plant.update({
      where: { id },
      data: {
        lastWateredDate: now,
        nextWateringDate: nextWateringDate,
        needsWater: false,
        updatedAt: new Date()
      }
    });

    // 케어 기록 추가
    await prisma.careRecord.create({
      data: {
        type: 'water',
        date: now,
        plantId: id,
        authorId: user.id,
        notes: '물주기 완료',
        isToday: true
      }
    });

    // 캐시 무효화
    revalidatePlantUpdate(user.id, id);

    return {
      success: true,
      message: '물주기가 기록되었습니다.',
      plant: updatedPlant
    };
  } catch (error) {
    console.error('물주기 기록 오류:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : '물주기 기록에 실패했습니다.'
    };
  }
}

// 영양제 기록
export async function updateNutrient(id: string) {
  try {
    const user = await requireAuth();

    const plant = await validatePlantOwnership(id, user.id);

    // 영양제 기록 업데이트
    const now = new Date();
    const nextNutrientDate = new Date(
      now.getTime() + (plant.nutrientInterval || 30) * 24 * 60 * 60 * 1000
    );

    const updatedPlant = await prisma.plant.update({
      where: { id },
      data: {
        lastNutrientDate: now,
        nextNutrientDate: nextNutrientDate,
        needsNutrient: false,
        updatedAt: new Date()
      }
    });

    // 케어 기록 추가
    await prisma.careRecord.create({
      data: {
        type: 'nutrient',
        date: now,
        plantId: id,
        authorId: user.id,
        notes: '영양제 공급 완료',
        isToday: true
      }
    });

    // 캐시 무효화
    revalidatePlantUpdate(user.id, id);

    return {
      success: true,
      message: '영양제 공급이 기록되었습니다.',
      plant: updatedPlant
    };
  } catch (error) {
    console.error('영양제 기록 오류:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : '영양제 기록에 실패했습니다.'
    };
  }
}

// 다이어리 작성용 간단한 식물 목록 조회 (id, name만 포함)
export async function getMyPlantsBasicInfo() {
  try {
    const user = await requireAuth();

    const plants = await prisma.plant.findMany({
      where: {
        authorId: user.id
      },
      select: {
        id: true,
        name: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return plants;
  } catch (error) {
    console.error('식물 목록 조회 오류:', error);
    throw new Error('식물 목록을 불러오는 중 오류가 발생했습니다.');
  }
}
