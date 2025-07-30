'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth-utils';
import { DEMO_CARE_RESPONSE } from '@/app/_constants/demoData';

// 케어 기록 타입 정의
type CareType = 'water' | 'nutrient' | 'pruning' | 'repot' | 'fertilizer';



/**
 * 사용자의 식물 케어 데이터 조회
 */
export async function getUserPlantsForCare(userId?: string) {
  try {
    const session = await auth();
    const targetUserId = userId || session?.user?.id;

    // 비로그인 데모 데이터
    if (!targetUserId) {
      return DEMO_CARE_RESPONSE;
    }

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

    // 데이터 변환 (기존 myPlants 구조와 호환)
    const transformedPlants = plants.map(plant => ({
      id: plant.id,
      name: plant.name,
      image: plant.image,
      isNew: isNewPlant(plant.createdAt),
      status: true,
      waterStatus: plant.needsWater,
      nutrientStatus: plant.needsNutrient,
      waterAmount: 150, // 기본값, 추후 실제 데이터로 대체
      lastWateredDate: plant.lastWateredDate?.toISOString().split('T')[0] || '',
      nextWateringDate:
        plant.nextWateringDate?.toISOString().split('T')[0] || '',
      waterInterval: plant.wateringInterval,
      lastNutrientDate:
        plant.lastNutrientDate?.toISOString().split('T')[0] || '',
      nextNutrientDate:
        plant.nextNutrientDate?.toISOString().split('T')[0] || '',
      nutrientInterval: plant.nutrientInterval,
      temperature: plant.temperature || 22,
      humidity: plant.humidity || 50,
      sunlight: plant.sunlight || 'bright'
    }));

    return transformedPlants;
  } catch (error) {
    console.error('식물 케어 데이터 조회 오류:', error);
    throw error;
  }
}

/**
 * 케어 기록 추가 (물주기, 영양제 등) - 간단 버전
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
    updateData.lastWateredDate = currentDate;
    updateData.nextWateringDate = new Date(
      currentDate.getTime() + plant.wateringInterval * 24 * 60 * 60 * 1000
    );
    updateData.needsWater = false;
  } else if (type === 'nutrient') {
    updateData.lastNutrientDate = currentDate;
    updateData.nextNutrientDate = new Date(
      currentDate.getTime() + plant.nutrientInterval * 24 * 60 * 60 * 1000
    );
    updateData.needsNutrient = false;
  }

  await prisma.plant.update({
    where: { id: plantId },
    data: updateData
  });

  // 캐시 재검증
  revalidatePath('/care');

  return { success: true };
}

/**
 * 식물 케어 일정 업데이트 - 간단 버전
 */
export async function updateCareSchedule(
  plantId: string,
  waterInterval?: number,
  nutrientInterval?: number
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('인증이 필요합니다');
  }

  const plant = await prisma.plant.findFirst({
    where: { id: plantId, authorId: session.user.id }
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

  revalidatePath('/care');
  return { success: true };
}

/**
 * 케어 기록 히스토리 조회 - 간단 버전
 */
export async function getCareHistory(plantId: string, limit: number = 10) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('인증이 필요합니다');
  }

  return await prisma.careRecord.findMany({
    where: {
      plantId,
      authorId: session.user.id
    },
    orderBy: { date: 'desc' },
    take: limit
  });
}

/**
 * 오늘 케어가 필요한 식물 조회 - 간단 버전
 */
export async function getTodayCareNeeds() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('인증이 필요합니다');
  }

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  return await prisma.plant.findMany({
    where: {
      authorId: session.user.id,
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
 * 식물의 케어 상태 토글 - 간단 버전
 */
export async function toggleCareStatus(
  plantId: string,
  careType: 'water' | 'nutrient',
  status: boolean
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('인증이 필요합니다');
  }

  await prisma.plant.update({
    where: {
      id: plantId,
      authorId: session.user.id // 소유권 확인을 update에서 처리
    },
    data:
      careType === 'water' ? { needsWater: status } : { needsNutrient: status }
  });

  revalidatePath('/care');
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
