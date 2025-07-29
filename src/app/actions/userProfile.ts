'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-utils';

// 사용자 프로필 데이터 타입
export type UserProfileData = {
  id: string;
  loginId: string;
  name: string;
  email: string | null;
  image: string | null;
  bio: string | null;
  isProfilePublic: boolean;
  level: number;
  levelProgress: number;
  waterCount: number;
  nutrientCount: number;
  interests: string[];
  _count: {
    plants: number;
    followersList: number;
    galleries: number;
  };
  todayWaterCount: number;
  todayNutrientCount: number;
};

// UUID 판별 유틸리티 함수
function isUUID(identifier: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
}

// 외부 통합 인터페이스
export async function getUserProfile(identifier: string): Promise<UserProfileData | null> {
  return isUUID(identifier)
    ? getUserProfileById(identifier)
    : getUserProfileByLoginId(identifier);
}

// 내부 구현: UUID로 조회
async function getUserProfileById(id: string): Promise<UserProfileData | null> {
  const user = await prisma.user.findUnique({
    where: { id: id },
    select: {
      id: true,
      loginId: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      isProfilePublic: true,
      level: true,
      levelProgress: true,
      waterCount: true,
      nutrientCount: true,
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

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayWaterCount = await prisma.careRecord.count({
    where: {
      authorId: user.id,
      type: 'water',
      date: { gte: todayStart }
    }
  });

  const todayNutrientCount = await prisma.careRecord.count({
    where: {
      authorId: user.id,
      type: 'nutrient',
      date: { gte: todayStart }
    }
  });

  return {
    ...user,
    todayWaterCount,
    todayNutrientCount
  };
}

// 내부 구현: loginId로 조회
async function getUserProfileByLoginId(loginId: string): Promise<UserProfileData | null> {
  const user = await prisma.user.findUnique({
    where: { loginId: loginId },
    select: {
      id: true,
      loginId: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      isProfilePublic: true,
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
      authorId: user.id,
      type: 'water',
      date: { gte: todayStart }
    }
  });

  // 4. 오늘의 영양제 카운트
  const todayNutrientCount = await prisma.careRecord.count({
    where: {
      authorId: user.id,
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

// 프로필 업데이트
export async function updateUserProfile(formData: FormData) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return;
    }
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

// 레거시 호환성을 위한 별칭
export const getUserProfileData = getUserProfile;