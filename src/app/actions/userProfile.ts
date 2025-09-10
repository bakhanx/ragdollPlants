'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath, unstable_cache } from 'next/cache';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-utils';
import { DEMO_USER_PROFILE } from '@/app/_constants/demoData';
import { CacheTags } from '@/lib/cache/cacheTags';
import { revalidateUserCache } from '@/lib/cache/cacheInvalidation';
import { getLevelInfo } from '@/lib/gamification';

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
  experience: number;
  levelTitle: string;
  levelProgress: number;
  nextLevelExp: number;
  currentLevelExp: number;
  waterCount: number;
  nutrientCount: number;
  interests: string[];
  _count: {
    plants: number;
    followersList: number;
    galleries: number;
  };
  needsWaterCount: number;
  needsNutrientCount: number;
};

// UUID 판별 유틸리티 함수
function isUUID(identifier: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    identifier
  );
}

// 외부 통합 인터페이스
export async function getUserProfile(
  identifier: string
): Promise<UserProfileData | null> {
  // 데모 사용자 처리
  if (identifier === 'demo-user') {
    return DEMO_USER_PROFILE;
  }

  return isUUID(identifier)
    ? getUserProfileById(identifier)
    : getUserProfileByLoginId(identifier);
}

// 내부 구현: UUID로 조회
async function getUserProfileByIdInternal(
  id: string
): Promise<UserProfileData | null> {
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
      experience: true,
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

  // 물이 필요한 식물 개수
  const needsWaterCount = await prisma.plant.count({
    where: {
      authorId: user.id,
      isActive: true,
      needsWater: true
    }
  });

  // 영양제가 필요한 식물 개수
  const needsNutrientCount = await prisma.plant.count({
    where: {
      authorId: user.id,
      isActive: true,
      needsNutrient: true
    }
  });

  // 레벨 정보 계산
  const levelInfo = getLevelInfo(user.experience);

  return {
    ...user,
    levelTitle: levelInfo.title,
    levelProgress: levelInfo.progress,
    nextLevelExp: levelInfo.nextLevelExp,
    currentLevelExp: levelInfo.requiredExp,
    needsWaterCount,
    needsNutrientCount
  };
}

// 캐시된 사용자 프로필 조회 (ID 기반)
function getCachedUserProfileById(id: string) {
  return unstable_cache(
    () => getUserProfileByIdInternal(id),
    [`user-profile-${id}`],
    {
      tags: [CacheTags.garden(id)]
    }
  )();
}

// 외부 인터페이스: UUID로 조회
async function getUserProfileById(id: string): Promise<UserProfileData | null> {
  return await getCachedUserProfileById(id);
}

// 내부 구현: loginId로 조회
async function getUserProfileByLoginIdInternal(
  loginId: string
): Promise<UserProfileData | null> {
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
      experience: true,
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

  // 물이 필요한 식물 개수
  const needsWaterCount = await prisma.plant.count({
    where: {
      authorId: user.id,
      isActive: true,
      needsWater: true
    }
  });

  // 영양제가 필요한 식물 개수
  const needsNutrientCount = await prisma.plant.count({
    where: {
      authorId: user.id,
      isActive: true,
      needsNutrient: true
    }
  });

  // 레벨 정보 계산
  const levelInfo = getLevelInfo(user.experience);

  // 결과 통합
  return {
    ...user,
    levelTitle: levelInfo.title,
    levelProgress: levelInfo.progress,
    nextLevelExp: levelInfo.nextLevelExp,
    currentLevelExp: levelInfo.requiredExp,
    needsWaterCount,
    needsNutrientCount
  };
}

// 캐시된 사용자 프로필 조회 (loginId 기반)
function getCachedUserProfileByLoginId(loginId: string) {
  return unstable_cache(
    () => getUserProfileByLoginIdInternal(loginId),
    [`user-profile-loginId-${loginId}`],
    {
      tags: [CacheTags.garden(loginId)]
    }
  )();
}

// 외부 인터페이스: loginId로 조회
async function getUserProfileByLoginId(
  loginId: string
): Promise<UserProfileData | null> {
  return await getCachedUserProfileByLoginId(loginId);
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

    // 캐시 무효화
    revalidateUserCache('gardenProfile', user.loginId);

    // 성공 시 정원으로 리다이렉트
    redirect('/garden');
  } catch (error) {
    // 에러 처리
    console.error('프로필 업데이트 오류:', error);
    throw error;
  }
}

// 레거시 호환성을 위한 별칭
export const getUserProfileData = getUserProfile;
