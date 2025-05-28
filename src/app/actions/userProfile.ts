'use server';

import { prisma } from '@/lib/prisma';

// src/app/actions/userProfile.ts
export async function getUserProfileData(userId: string) {
  // 1. 사용자 기본 정보 조회
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      // 필요한 모든 필드
      id: true,
      name: true,
      level: true,
      levelProgress: true,
      waterCount: true, // 누적 물주기
      nutrientCount: true, // 누적 영양제
      interests: true,
      _count: {
        select: {
          plants: true,
          followersList: true,
          galleries: true
        }
      }
    }
  });

  if (!user) return null;

  // 2. 오늘의 시작 시간 설정
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // 3. 오늘의 물주기 카운트
  const todayWaterCount = await prisma.careRecord.count({
    where: {
      authorId: userId,
      type: 'water',
      date: { gte: todayStart }
    }
  });

  // 4. 오늘의 영양제 카운트
  const todayNutrientCount = await prisma.careRecord.count({
    where: {
      authorId: userId,
      type: 'nutrient',
      date: { gte: todayStart }
    }
  });

  // 5. 결과 통합
  return {
    ...user,
    todayWaterCount,
    todayNutrientCount
  };
}
