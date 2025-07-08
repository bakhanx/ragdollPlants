'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-utils';

// 사용자 프로필 조회
export async function getUserProfileData(userId: string) {
  // 1. 사용자 기본 정보 조회
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      // 필요한 모든 필드
      id: true,
      name: true,
      image: true,
      bio: true,
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

// 프로필 업데이트 Server Action
export async function updateUserProfile(formData: FormData) {
  try {
    const user = await getCurrentUser();

    // FormData에서 데이터 추출
    const name = formData.get('name') as string;
    const bio = formData.get('bio') as string;
    const interests = formData.get('interests') as string;
    const image = formData.get('image') as string;

    // 입력 검증
    if (!name || name.trim() === '') {
      throw new Error('이름은 필수입니다');
    }

    const parsedInterests = interests ? JSON.parse(interests) : [];
    if (parsedInterests.length > 20) {
      throw new Error('관심사는 최대 20개까지 선택 가능합니다');
    }

    // 프로필 업데이트
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name.trim(),
        bio: bio?.trim() || null,
        interests: parsedInterests,
        image: image || null
      }
    });

    // 캐시 재검증
    revalidatePath('/mygarden');
    revalidatePath('/mygarden/profile');

    // 성공 시 마이가든으로 리다이렉트
    redirect('/mygarden');
  } catch (error) {
    // 에러 처리
    console.error('프로필 업데이트 오류:', error);
    throw error;
  }
}
