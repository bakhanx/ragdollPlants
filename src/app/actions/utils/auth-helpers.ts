'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

/**
 * 현재 로그인한 사용자 정보 조회
 */
export async function getCurrentUser() {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error('로그인이 필요합니다.');
  }
  
  return session.user;
}

/**
 * 관리자 권한 확인
 */
export async function requireAdmin(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  if (user?.role !== 'ADMIN') {
    throw new Error('관리자만 접근할 수 있습니다.');
  }

  return true;
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
export async function validateArticleOwnership(articleId: string, userId: string) {
  const article = await prisma.article.findFirst({
    where: { id: articleId, authorId: userId }
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
export async function validateGalleryOwnership(galleryId: string, userId: string) {
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
export async function validateEventOwnership(eventId: string, userId: string) {
  const event = await prisma.event.findFirst({
    where: { id: eventId, authorId: userId }
  });

  if (!event) {
    throw new Error('해당 이벤트에 대한 권한이 없습니다.');
  }

  return event;
} 