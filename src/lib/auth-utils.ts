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
 * DB에서 사용자 존재 여부 확인
 */
export async function checkUserExists(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true }
  });
  return !!user;
}

/**
 * 현재 로그인한 사용자 정보 조회 (nullable)
 * 모든 페이지에서 사용 - 로그인 여부에 관계없이 안전
 */
export async function getCurrentUser() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  return {
    id: session.user.id,
    loginId: session.user.loginId,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role
  };
}

/**
 * 로그인이 필요한 액션용 - 로그인하지 않으면 에러
 * Server Actions에서만 사용
 */
export async function requireAuth() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('AUTH_REQUIRED');
  }
  
  // 세션이 있을 때 DB에서 사용자 존재 여부 확인
  const userExists = await checkUserExists(session.user.id);
  
  if (!userExists) {
    throw new Error('AUTH_MISMATCH');
  }

  return {
    id: session.user.id,
    loginId: session.user.loginId,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role
  };
}

/**
 * 관리자 권한 확인
 */
export async function requireAdmin() {
  const user = await requireAuth();

  if (user.role !== USER_ROLES.ADMIN) {
    throw new Error('ADMIN_REQUIRED');
  }

  return user;
}

/**
 * 현재 사용자가 관리자인지 확인 (로그인하지 않은 경우 false 반환)
 */
export async function checkIsAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === USER_ROLES.ADMIN || false;
}

/**
 * 소유권 확인 헬퍼들
 */
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
 * Server Action 표준 응답 타입
 */
export type ServerActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  redirectTo?: string;
  needsAuth?: boolean;
  message?: string;
};

/**
 * Server Action 에러 처리
 */
export function handleAuthError(error: Error): ServerActionResult {
  if (error.message === 'AUTH_REQUIRED') {
    return {
      success: false,
      needsAuth: true,
      message: '로그인이 필요합니다.',
      error: '로그인이 필요합니다.'
    };
  }
  
  if (error.message === 'AUTH_MISMATCH') {
    return {
      success: false,
      needsAuth: true,
      message: '인증 정보 불일치로 인하여 다시 로그인이 필요합니다.',
      error: '인증 정보 불일치'
    };
  }

  if (error.message === 'ADMIN_REQUIRED') {
    return {
      success: false,
      error: '관리자만 접근할 수 있습니다.'
    };
  }

  return {
    success: false,
    error: error.message
  };
}

/**
 * 클라이언트용 인증 에러 처리
 */
export function handleClientAuthError(
  result: ServerActionResult,
  router: { push: (path: string) => void },
  showToast?: (message: string) => void
) {
  if (!result.success && result.needsAuth) {
    showToast?.(result.message || '로그인이 필요합니다.');
    router.push('/login');
    return true;
  }
  return false;
}
