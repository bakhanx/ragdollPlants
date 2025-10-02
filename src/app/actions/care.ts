'use server';

import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';
import { requireAuth, getCurrentUser, checkUserExists } from '@/lib/auth-utils';
import { CacheTags } from '@/lib/cache/cacheTags';
import { revalidatePlantUpdate } from '@/lib/cache/cacheInvalidation';
import { CareResponse } from '@/types/cache/care';
import { grantExperience } from '@/lib/gamification';
import { DemoService } from '@/services/demoService';
import { createCareCompletionNotification } from '@/lib/notifications/utils';

// 케어 기록 타입 정의
type CareType = 'water' | 'nutrient' | 'pruning' | 'repot' | 'fertilizer';

/**
 * Date 객체를 시간대 독립적인 YYYY-MM-DD 문자열로 변환
 */
function formatDateToString(date: Date | null): string {
  if (!date) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

// 사용자의 식물 케어 데이터 조회
async function getUserPlantsForCareInternal(
  targetUserId: string
): Promise<CareResponse> {
  // 사용자의 모든 활성 식물 조회
  const plants = await prisma.plant.findMany({
    where: {
      authorId: targetUserId,
      isActive: true
    },
    select: {
      id: true,
      name: true,
      image: true,
      category: true,
      location: true,
      wateringInterval: true,
      nutrientInterval: true,
      lastWateredDate: true,
      nextWateringDate: true,
      lastNutrientDate: true,
      nextNutrientDate: true,
      needsWater: true,
      needsNutrient: true,
      temperature: true,
      humidity: true,
      sunlight: true,
      createdAt: true
    },
    orderBy: {
      nextWateringDate: 'asc'
    }
  });

  // 데이터 변환
  const transformedPlants = plants.map(plant => ({
    id: plant.id,
    name: plant.name,
    image: plant.image,
    isNew: isNewPlant(plant.createdAt),
    status: true,
    waterStatus: plant.needsWater,
    nutrientStatus: plant.needsNutrient,
    waterAmount: 150, // 기본값
    lastWateredDate: formatDateToString(plant.lastWateredDate),
    nextWateringDate: formatDateToString(plant.nextWateringDate),
    waterInterval: plant.wateringInterval,
    lastNutrientDate: formatDateToString(plant.lastNutrientDate),
    nextNutrientDate: formatDateToString(plant.nextNutrientDate),
    nutrientInterval: plant.nutrientInterval,
    temperature: plant.temperature || 22,
    humidity: plant.humidity || 50,
    sunlight: plant.sunlight || 'bright'
  }));

  return transformedPlants;
}

// 캐시된 사용자 식물 케어 데이터 조회
function getCachedUserPlantsForCare(targetUserId: string) {
  return unstable_cache(
    () => getUserPlantsForCareInternal(targetUserId),
    [`care-${targetUserId}`],
    {
      tags: [CacheTags.care(targetUserId)]
    }
  )();
}

/**
 * 사용자의 식물 케어 데이터 조회
 */
export async function getUserPlantsForCare(userId?: string): Promise<{
  plants: CareResponse;
  isLoggedIn: boolean;
  authMismatch?: boolean;
}> {
  try {
    const currentUser = await getCurrentUser();
    const targetUserId = userId || currentUser?.id;

    // 비로그인 데모 데이터
    if (!targetUserId) {
      return {
        plants: DemoService.getDemoCareData(),
        isLoggedIn: false
      };
    }

    // 세션이 있지만 타겟 사용자가 세션 사용자와 같을 때 DB 검증
    if (currentUser && !userId && targetUserId === currentUser.id) {
      const userExists = await checkUserExists(targetUserId);

      // 세션은 있지만 DB에 사용자가 없는 경우
      if (!userExists) {
        return {
          plants: DemoService.getDemoCareData(),
          isLoggedIn: false,
          authMismatch: true
        };
      }
    }

    // 실제 데이터 처리
    const plants = await getCachedUserPlantsForCare(targetUserId);
    return {
      plants,
      isLoggedIn: true
    };
  } catch (error) {
    console.error('식물 케어 데이터 조회 오류:', error);
    throw error;
  }
}

/**
 * 케어 기록 추가 (물주기, 영양제 등)
 */
export async function addCareRecord(
  plantId: string,
  type: CareType,
  amount?: number,
  notes?: string
) {
  const user = await requireAuth();

  // 간단한 입력 검증
  if (!plantId || !type) {
    throw new Error('필수 정보가 누락되었습니다');
  }

  // 식물 정보 조회 (소유권 자동 확인)
  const plant = await prisma.plant.findFirst({
    where: { id: plantId, authorId: user.id }
  });

  if (!plant) {
    throw new Error('식물을 찾을 수 없습니다');
  }

  // 케어 기록 생성
  await prisma.careRecord.create({
    data: {
      type,
      amount,
      notes,
      date: new Date(),
      plantId,
      authorId: user.id
    }
  });

  // 식물 상태 업데이트
  const currentDate = new Date();
  const updateData: {
    lastWateredDate?: Date;
    nextWateringDate?: Date;
    needsWater?: boolean;
    lastNutrientDate?: Date;
    nextNutrientDate?: Date;
    needsNutrient?: boolean;
  } = {};

  if (type === 'water') {
    // 시간대 독립적 날짜 계산
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const nextWatering = new Date(today);
    nextWatering.setDate(today.getDate() + plant.wateringInterval);

    updateData.lastWateredDate = today;
    updateData.nextWateringDate = nextWatering;
    updateData.needsWater = false;
  } else if (type === 'nutrient') {
    // 시간대 독립적 날짜 계산
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const nextNutrient = new Date(today);
    nextNutrient.setDate(today.getDate() + plant.nutrientInterval);

    updateData.lastNutrientDate = today;
    updateData.nextNutrientDate = nextNutrient;
    updateData.needsNutrient = false;
  }

  await prisma.plant.update({
    where: { id: plantId },
    data: updateData
  });

  // 사용자 누적 카운트 업데이트 및 경험치 부여
  const experiencePoints = type === 'water' ? 10 : 15;

  if (type === 'water') {
    await Promise.all([
      prisma.user.update({
        where: { id: user.id },
        data: { waterCount: { increment: 1 } }
      }),
      // 물주기 경험치 부여 (+10)
      grantExperience(user.id, 'WATER_PLANT', '식물에 물 주기'),
      // 케어 완료 알림 생성
      createCareCompletionNotification(
        user.id,
        plant.id,
        plant.name,
        'water',
        experiencePoints
      )
    ]);
  } else if (type === 'nutrient') {
    await Promise.all([
      prisma.user.update({
        where: { id: user.id },
        data: { nutrientCount: { increment: 1 } }
      }),
      // 영양제 경험치 부여 (+15)
      grantExperience(user.id, 'ADD_NUTRIENT', '식물에 영양제 주기'),
      // 케어 완료 알림 생성
      createCareCompletionNotification(
        user.id,
        plant.id,
        plant.name,
        'nutrient',
        experiencePoints
      )
    ]);
  }

  // 캐시 무효화
  revalidatePlantUpdate(user.id, plantId);
  return { success: true };
}

/**
 * 식물 케어 일정 업데이트
 */
export async function updateCareSchedule(
  plantId: string,
  waterInterval?: number,
  nutrientInterval?: number
) {
  const user = await requireAuth();

  const plant = await prisma.plant.findFirst({
    where: { id: plantId, authorId: user.id }
  });

  if (!plant) {
    throw new Error('식물을 찾을 수 없습니다');
  }

  const updateData: {
    wateringInterval?: number;
    nextWateringDate?: Date;
    nutrientInterval?: number;
    nextNutrientDate?: Date;
  } = {};

  if (waterInterval && waterInterval > 0) {
    updateData.wateringInterval = waterInterval;
    if (plant.lastWateredDate) {
      updateData.nextWateringDate = new Date(
        plant.lastWateredDate.getTime() + waterInterval * 24 * 60 * 60 * 1000
      );
    }
  }

  if (nutrientInterval && nutrientInterval > 0) {
    updateData.nutrientInterval = nutrientInterval;
    if (plant.lastNutrientDate) {
      updateData.nextNutrientDate = new Date(
        plant.lastNutrientDate.getTime() +
          nutrientInterval * 24 * 60 * 60 * 1000
      );
    }
  }

  await prisma.plant.update({
    where: { id: plantId },
    data: updateData
  });

  // 캐시 무효화
  revalidatePlantUpdate(user.id, plantId);
  return { success: true };
}

/**
 * 케어 기록 히스토리 조회
 */
export async function getCareHistory(plantId: string, limit: number = 10) {
  const user = await requireAuth();

  return await prisma.careRecord.findMany({
    where: {
      plantId,
      authorId: user.id
    },
    orderBy: { date: 'desc' },
    take: limit
  });
}

/**
 * 오늘 케어가 필요한 식물 조회
 */
export async function getTodayCareNeeds() {
  const user = await requireAuth();

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  return await prisma.plant.findMany({
    where: {
      authorId: user.id,
      isActive: true,
      OR: [
        { nextWateringDate: { lte: today } },
        { nextNutrientDate: { lte: today } }
      ]
    },
    select: {
      id: true,
      name: true,
      image: true,
      nextWateringDate: true,
      nextNutrientDate: true,
      needsWater: true,
      needsNutrient: true
    },
    orderBy: { nextWateringDate: 'asc' }
  });
}

/**
 * 식물의 케어 상태 토글
 */
export async function toggleCareStatus(
  plantId: string,
  careType: 'water' | 'nutrient',
  status: boolean
) {
  const user = await requireAuth();

  await prisma.plant.update({
    where: {
      id: plantId,
      authorId: user.id
    },
    data:
      careType === 'water' ? { needsWater: status } : { needsNutrient: status }
  });

  // 캐시 무효화
  revalidatePlantUpdate(user.id, plantId);
  return { success: true };
}

// 헬퍼 함수들

/**
 * 식물이 신규인지 확인 (7일 이내 등록)
 */
function isNewPlant(createdAt: Date): boolean {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return createdAt > weekAgo;
}

/**
 * 다음 케어 날짜 계산
 */
function calculateNextCareDate(lastDate: Date, interval: number): Date {
  const nextDate = new Date(lastDate);
  nextDate.setDate(nextDate.getDate() + interval);
  return nextDate;
}

/**
 * 케어가 지연된 일수 계산
 */
function calculateOverdueDays(nextCareDate: Date): number {
  const today = new Date();
  const diffTime = today.getTime() - nextCareDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}
