'use server';

import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';

type ContentType = 'diary' | 'plant' | 'gallery';

type ContentWithMetadata = {
  id: string;
  authorId: string;
  isPublic: boolean;
  title?: string | null;
  name?: string; // Plant 모델용
};

async function findContent(
  contentType: ContentType,
  contentId: string
): Promise<ContentWithMetadata | null> {
  switch (contentType) {
    case 'diary':
      return prisma.diary.findUnique({
        where: { id: contentId },
        select: { id: true, authorId: true, isPublic: true, title: true }
      });
    case 'plant':
      return prisma.plant.findUnique({
        where: { id: contentId },
        select: { id: true, authorId: true, isPublic: true, name: true }
      });
    case 'gallery':
      return prisma.gallery.findUnique({
        where: { id: contentId },
        select: { id: true, authorId: true, isPublic: true, title: true }
      });
    default:
      return null;
  }
}

export async function toggleLike(contentType: ContentType, contentId: string) {
  try {
    const user = await requireAuth();

    const content = await findContent(contentType, contentId);

    if (!content || (!content.isPublic && content.authorId !== user.id)) {
      throw new Error('콘텐츠를 찾을 수 없거나 접근 권한이 없습니다.');
    }

    const contentTitle = content.title || content.name || '게시물';
    const path = `/${contentType === 'plant' ? 'myplants' : contentType}s`;

    // 2. 기존 '좋아요' 확인 및 토글
    const likeWhere = {
      type: contentType,
      targetId: contentId,
      userId: user.id
    };

    const existingLike = await prisma.like.findFirst({ where: likeWhere });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
    } else {
      await prisma.like.create({ data: likeWhere });

      // 3. 알림 생성
      if (user.id !== content.authorId) {
        await prisma.notification.create({
          data: {
            type: 'CONTENT_LIKED',
            recipientId: content.authorId,
            actorId: user.id,
            title: '새로운 좋아요!',
            message: `${user.name || '누군가'}님이 회원님의 "${contentTitle}"을(를) 좋아합니다.`,
            link: `${path}/${content.id}`,
            [`${contentType}Id`]: content.id
          }
        });
      }
    }

    // 4. 새로운 좋아요 수 조회
    const newLikesCount = await prisma.like.count({
      where: { targetId: contentId }
    });

    return {
      success: true,
      likes: newLikesCount,
      isLiked: !existingLike
    };
  } catch (error) {
    console.error(`${contentType} 좋아요 토글 오류:`, error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: '좋아요 처리 중 오류가 발생했습니다.' };
  }
}

// --- Helper Functions ---

type ContentItem = {
  id: string | number;
  [key: string]: unknown;
};

type LikeableContentType = 'article' | 'diary' | 'gallery' | 'plant';

/**
 * @param items - Article, Diary 등 id를 포함한 객체 배열
 * @param type - 콘텐츠 타입 (e.g., 'article', 'diary')
 * @param userId - 현재 로그인한 사용자의 ID (선택 사항)
 * @returns 'likes'와 'isLiked'가 추가된 객체 배열
 */
export async function populateLikeInfo<T extends ContentItem>(
  items: T[],
  type: LikeableContentType,
  userId?: string
): Promise<(T & { likes: number; isLiked: boolean })[]> {
  if (items.length === 0) {
    return items.map(item => ({ ...item, likes: 0, isLiked: false }));
  }

  const itemIds = items.map(item => String(item.id));

  // 좋아요 수, 사용자 좋아요 여부 병렬 조회
  const [likeCounts, userLikes] = await Promise.all([
    // '좋아요' 수 일괄 조회
    prisma.like.groupBy({
      by: ['targetId'],
      where: {
        type: type,
        targetId: { in: itemIds }
      },
      _count: { _all: true }
    }),
    // 현재 사용자의 '좋아요' 여부 일괄 조회 (로그인한 경우에만)
    userId
      ? prisma.like.findMany({
          where: {
            userId: userId,
            type: type,
            targetId: { in: itemIds }
          },
          select: { targetId: true }
        })
      : Promise.resolve([])
  ]);

  const likeCountMap = new Map(
    likeCounts.map(item => [item.targetId, item._count._all || 0])
  );

  const likedItemIds = new Set(userLikes.map(like => like.targetId));

  // 3. 원본 데이터와 '좋아요' 정보 결합
  return items.map(item => ({
    ...item,
    likes: likeCountMap.get(String(item.id)) || 0,
    isLiked: likedItemIds.has(String(item.id))
  }));
}
