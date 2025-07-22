// auth.ts에서 핵심 함수들 re-export
export { auth, signIn, signOut } from '@/auth';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// 사용자 역할 정의
export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN'
} as const;

export type UserRole = keyof typeof USER_ROLES;

/**
 * 현재 로그인한 사용자 정보 조회
 * 일반적인 사용자 액션에서 사용
 */
export async function getCurrentUser() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role
  };
}

/**
 * 세션 정보 조회 (로그인하지 않은 경우에도 안전)
 * 공개 페이지에서 UI 차별화 목적으로 사용
 */
export async function getSession() {
  return await auth();
}

/**
 * 현재 사용자가 관리자인지 확인 (로그인하지 않은 경우 false 반환)
 */
export async function checkIsAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === USER_ROLES.ADMIN || false;
}

/**
 * * 관리자 전용 액션
 * 관리자 권한 확인 및 사용자 정보 반환
 */
export async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    throw new Error('로그인이 필요합니다.');
  }

  if (session.user.role !== USER_ROLES.ADMIN) {
    throw new Error('관리자만 접근할 수 있습니다.');
  }

  // 사용자 정보를 바로 반환 (추가 호출 불필요)
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role
  };
}

/**
 * 식물 소유권 확인
 */
export async function validatePlantOwnership(plantId: string, userId: string) {
  const plant = await prisma.plant.findFirst({
    where: { id: plantId, authorId: userId }
  });

  if (!plant) {
    throw new Error('해당 식물에 대한 권한이 없습니다.');
  }

  return plant;
}

/**
 * 아티클 소유권 확인
 */
export async function validateArticleOwnership(
  articleId: number | string,
  userId: string
) {
  const id =
    typeof articleId === 'string' ? parseInt(articleId, 10) : articleId;

  const article = await prisma.article.findFirst({
    where: { id, authorId: userId }
  });

  if (!article) {
    throw new Error('해당 아티클에 대한 권한이 없습니다.');
  }

  return article;
}

/**
 * 다이어리 소유권 확인
 */
export async function validateDiaryOwnership(diaryId: string, userId: string) {
  const diary = await prisma.diary.findFirst({
    where: { id: diaryId, authorId: userId }
  });

  if (!diary) {
    throw new Error('해당 다이어리에 대한 권한이 없습니다.');
  }

  return diary;
}

/**
 * 갤러리 소유권 확인
 */
export async function validateGalleryOwnership(
  galleryId: string,
  userId: string
) {
  const gallery = await prisma.gallery.findFirst({
    where: { id: galleryId, authorId: userId }
  });

  if (!gallery) {
    throw new Error('해당 갤러리에 대한 권한이 없습니다.');
  }

  return gallery;
}

/**
 * 이벤트 소유권 확인
 */
export async function validateEventOwnership(
  eventId: number | string,
  userId: string
) {
  const id = typeof eventId === 'string' ? parseInt(eventId, 10) : eventId;

  const event = await prisma.event.findFirst({
    where: { id, authorId: userId }
  });

  if (!event) {
    throw new Error('해당 이벤트에 대한 권한이 없습니다.');
  }

  return event;
}

/**
 * 관리자에게 필요없는 필드들을 필터링
 */
export function filterUserFields(user: {
  role: string;
  following?: number;
  followers?: number;
  posts?: number;
  level?: number;
  levelProgress?: number;
  waterCount?: number;
  nutrientCount?: number;
  interests?: string[];
  [key: string]: unknown;
}) {
  if (user.role !== USER_ROLES.USER) {
    // 관리자는 식물 관련 필드 제거
    const {
      following,
      followers,
      posts,
      level,
      levelProgress,
      waterCount,
      nutrientCount,
      interests,
      ...adminUser
    } = user;
    return adminUser;
  }
  return user;
}
