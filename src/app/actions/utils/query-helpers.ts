'use server';

import { prisma } from '@/lib/prisma';

/**
 * 사용자 선택 필드 (author 정보용)
 */
export const userSelectFields = {
  id: true,
  name: true,
  image: true
} as const;

/**
 * 갤러리 목록 조회
 */
export async function getGalleriesWithLikes() {
  const galleries = await prisma.gallery.findMany({
    select: {
      id: true,
      title: true,
      image: true,
      description: true,
      createdAt: true,
      plantId: true,
      tags: true,
      author: { select: userSelectFields },
      plant: { select: { id: true, name: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  // 갤러리 ID 목록 추출
  const galleryIds = galleries.map(g => g.id);

  // 좋아요 수
  const likeCounts = await prisma.like.groupBy({
    by: ['targetId'],
    where: {
      type: 'gallery',
      targetId: { in: galleryIds }
    },
    _count: { _all: true }
  });

  const likeCountMap = new Map(
    likeCounts.map(item => [item.targetId, item._count._all])
  );

  // 갤러리와 좋아요 수 결합
  return galleries.map(gallery => ({
    ...gallery,
    likes: likeCountMap.get(gallery.id) || 0
  }));
}

/**
 * 사용자별 갤러리 조회
 */
export async function getUserGalleriesWithLikes(userId: string) {
  const galleries = await prisma.gallery.findMany({
    where: { authorId: userId },
    select: {
      id: true,
      title: true,
      image: true,
      description: true,
      createdAt: true,
      plantId: true,
      tags: true,
      author: { select: userSelectFields },
      plant: { select: { id: true, name: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  const galleryIds = galleries.map(g => g.id);
  const likeCounts = await prisma.like.groupBy({
    by: ['targetId'],
    where: {
      type: 'gallery',
      targetId: { in: galleryIds }
    },
    _count: { _all: true }
  });

  const likeCountMap = new Map(
    likeCounts.map(item => [item.targetId, item._count._all])
  );

  return galleries.map(gallery => ({
    ...gallery,
    likes: likeCountMap.get(gallery.id) || 0
  }));
}

/**
 * 단일 갤러리 조회
 */
export async function getGalleryByIdWithLikes(id: string) {
  const gallery = await prisma.gallery.findUnique({
    where: { id },
    include: {
      author: { select: userSelectFields },
      plant: { select: { id: true, name: true } }
    }
  });

  if (!gallery) return null;

  const likesCount = await prisma.like.count({
    where: {
      type: 'gallery',
      targetId: id
    }
  });

  return {
    ...gallery,
    likes: likesCount
  };
}

/**
 * 식물 목록 조회
 */
export async function getOptimizedPlantsList(userId: string) {
  return await prisma.plant.findMany({
    where: { authorId: userId },
    select: {
      id: true,
      name: true,
      image: true,
      category: true,
      location: true,
      needsWater: true,
      needsNutrient: true,
      lastWateredDate: true,
      nextWateringDate: true,
      lastNutrientDate: true,
      nextNutrientDate: true,
      wateringInterval: true,
      nutrientInterval: true,
      createdAt: true,
      author: { select: userSelectFields }
    },
    orderBy: { createdAt: 'desc' }
  });
}

/**
 * 아티클 목록 조회
 */
export async function getOptimizedArticlesList() {
  return await prisma.article.findMany({
    where: { isPublished: true },
    select: {
      id: true,
      title: true,
      summary: true,
      image: true,
      tags: true,
      viewCount: true,
      createdAt: true,
      author: { select: userSelectFields },
      category: { select: { id: true, name: true, color: true } },
      _count: { select: { comments: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
}

/**
 * 다이어리 목록 조회
 */
export async function getOptimizedDiariesList() {
  return await prisma.diary.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      image: true,
      status: true,
      date: true,
      plantId: true,
      tags: true,
      createdAt: true,
      author: { select: userSelectFields },
      plant: { select: { id: true, name: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
}

/**
 * 이벤트 목록 조회
 */
export async function getOptimizedEventsList(activeOnly: boolean = false) {
  return await prisma.event.findMany({
    where: activeOnly ? { isEnded: false } : undefined,
    select: {
      id: true,
      title: true,
      subtitle: true,
      description: true,
      image: true,
      link: true,
      startDate: true,
      endDate: true,
      isEnded: true,
      viewCount: true,
      createdAt: true,
      author: { select: userSelectFields }
    },
    orderBy: { createdAt: 'desc' }
  });
}
