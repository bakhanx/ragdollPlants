'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath, unstable_cache } from 'next/cache';
import { z } from 'zod';
import {
  getCurrentUser,
  validateArticleOwnership,
  ServerActionResult,
  requireAdmin
} from '@/lib/auth-utils';
import {
  uploadImageToCloudflare,
  deleteImageFromCloudflare
} from '@/lib/cloudflare-images';
import { ArticleCategory } from '@/types/models/article';
import { CacheTags } from '@/lib/cache/cacheTags';
import {
  revalidateUserCache,
  revalidateArticleUpdate
} from '@/lib/cache/cacheInvalidation';
import { CachedArticle, PublicArticlesResponse } from '@/types/cache/article';
import { articleForCache } from '@/app/_utils/cacheUtils';

// 카테고리 목록 조회
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    return categories;
  } catch (error) {
    console.error('카테고리 조회 실패:', error);
    return [];
  }
}

// 아티클 생성 유효성 검사 스키마
const createArticleSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다'),
  content: z.string().min(1, '내용은 필수입니다'),
  summary: z.string().optional(),
  tags: z.array(z.string()).optional(),
  categoryId: z.string().min(1, '카테고리는 필수입니다')
});

// 아티클 목록 조회
async function getArticlesInternal(): Promise<PublicArticlesResponse> {
  const articles = await prisma.article.findMany({
    where: {
      isPublished: true,
      isActive: true
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true
        }
      },
      category: {
        select: {
          id: true,
          name: true,
          color: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // 캐시용 데이터로 변환
  const cachedArticles = articles.map(articleForCache);
  return cachedArticles;
}

// 캐시된 아티클 목록 조회
const getCachedArticles = unstable_cache(
  () => getArticlesInternal(),
  ['articles-all'],
  {
    tags: [CacheTags.allArticles]
  }
);

// 모든 아티클 조회 (캐시 적용)
export async function getArticles(): Promise<CachedArticle[]> {
  try {
    return getCachedArticles();
  } catch (error) {
    console.error('아티클 목록 조회 오류:', error);
    throw new Error('아티클 목록을 불러오는 중 오류가 발생했습니다.');
  }
}

// 특정 아티클 조회
export async function getArticleById(id: number) {
  try {
    const currentUser = await getCurrentUser().catch(() => null);

    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        category: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!article || !article.isActive) {
      throw new Error('아티클을 찾을 수 없거나 비활성화된 게시물입니다.');
    }

    // 조회수 증가, '좋아요' 정보 조회를 병렬 실행
    const articleIdStr = String(article.id);
    const [_, likesCount, userLike] = await Promise.all([
      prisma.article.update({
        where: { id },
        data: { viewCount: { increment: 1 } }
      }),
      prisma.like.count({
        where: { type: 'article', targetId: articleIdStr }
      }),
      currentUser
        ? prisma.like.findFirst({
            where: {
              userId: currentUser.id,
              type: 'article',
              targetId: articleIdStr
            }
          })
        : Promise.resolve(null)
    ]);

    return { ...article, likes: likesCount, isLiked: !!userLike };
  } catch (error) {
    console.error('아티클 조회 오류:', error);
    throw error;
  }
}

// 아티클 생성
export async function createArticle(
  formData: FormData
): Promise<ServerActionResult<{ articleId: number; redirectTo: string }>> {
  try {
    const user = await requireAdmin();

    if (!user) {
      return {
        success: false,
        needsAuth: true,
        redirectTo: '/login',
        error: '로그인이 필요합니다.'
      };
    }

    const rawData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      summary: formData.get('summary') as string,
      categoryId: formData.get('categoryId') as string
    };

    // 태그 처리
    const tagsJson = formData.get('tags') as string;
    let tags: string[] = [];
    if (tagsJson) {
      try {
        tags = JSON.parse(tagsJson);
      } catch (e) {
        console.error('태그 파싱 오류:', e);
      }
    }

    // 썸네일 이미지 처리
    let thumbnailUrl = '/images/plant-default.webp';
    const thumbnailFile = formData.get('thumbnail') as File | null;

    if (thumbnailFile && thumbnailFile.size > 0) {
      thumbnailUrl = await uploadImageToCloudflare(
        thumbnailFile,
        '/images/plant-default.webp'
      );
    }

    // 입력 검증
    const validationResult = createArticleSchema.safeParse({
      ...rawData,
      tags
    });

    if (!validationResult.success) {
      const errors = validationResult.error.errors
        .map(err => err.message)
        .join(', ');
      throw new Error(errors);
    }

    const validatedData = validationResult.data;

    // 아티클 생성
    const article = await prisma.article.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        summary: validatedData.summary || null,
        image: thumbnailUrl,
        tags: validatedData.tags || [],
        authorId: user.id,
        categoryId: validatedData.categoryId,
        isPublished: true
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        category: true
      }
    });

    console.log('아티클 생성 완료:', { id: article.id, title: article.title });

    // 캐시 무효화
    revalidateUserCache('articleCreate', user.id);

    // 성공 결과 반환
    return {
      success: true,
      data: {
        articleId: article.id,
        redirectTo: `/articles/${article.id}`
      },
      message: '아티클이 성공적으로 생성되었습니다.'
    };
  } catch (error) {
    console.error('아티클 생성 오류:', error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : '아티클 생성에 실패했습니다'
    };
  }
}

// 아티클 수정
export async function updateArticle(id: number, formData: FormData) {
  try {
    const user = await requireAdmin();

    if (!user) {
      return {
        success: false,
        needsAuth: true,
        redirectTo: '/login',
        error: '로그인이 필요합니다.'
      };
    }

    // 기존 아티클 확인 및 권한 체크
    const existingArticle = await validateArticleOwnership(id, user.id);

    const rawData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      summary: formData.get('summary') as string,
      categoryId: formData.get('categoryId') as string
    };

    const tagsJson = formData.get('tags') as string;
    let tags: string[] = [];
    if (tagsJson) {
      try {
        tags = JSON.parse(tagsJson);
      } catch (e) {
        console.error('태그 파싱 오류:', e);
      }
    }

    // 썸네일 이미지 처리
    let thumbnailUrl = existingArticle.image || '/images/plant-default.webp';
    const thumbnailFile = formData.get('thumbnail') as File | null;

    if (thumbnailFile && thumbnailFile.size > 0) {
      // 새 이미지 업로드
      thumbnailUrl = await uploadImageToCloudflare(
        thumbnailFile,
        '/images/plant-default.webp'
      );

      // 기존 이미지 삭제 (기본 이미지가 아닌 경우)
      if (
        existingArticle.image &&
        !existingArticle.image.includes('/images/plant-default.webp') &&
        !existingArticle.image.startsWith('data:')
      ) {
        await deleteImageFromCloudflare(existingArticle.image);
      }
    }

    // 입력 검증
    const validationResult = createArticleSchema.safeParse({
      ...rawData,
      tags
    });

    if (!validationResult.success) {
      const errors = validationResult.error.errors
        .map(err => err.message)
        .join(', ');
      throw new Error(errors);
    }

    const validatedData = validationResult.data;

    // 아티클 업데이트
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        title: validatedData.title,
        content: validatedData.content,
        summary: validatedData.summary || null,
        tags: validatedData.tags || [],
        categoryId: validatedData.categoryId,
        image: thumbnailUrl
      }
    });

    console.log('아티클 수정 완료:', {
      id: updatedArticle.id,
      title: updatedArticle.title
    });

    // 캐시 무효화
    revalidateArticleUpdate(user.id, id.toString());

    // 성공 결과 반환
    return {
      success: true,
      articleId: id,
      redirectTo: `/articles/${id}`
    };
  } catch (error) {
    console.error('아티클 수정 오류:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : '아티클 수정에 실패했습니다'
    };
  }
}

// 홈페이지용 최신 아티클 조회 내부 구현
async function getLatestArticlesInternal(limit: number = 3): Promise<CachedArticle[]> {
  const articles = await prisma.article.findMany({
    where: { isPublished: true, isActive: true },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true
        }
      },
      category: {
        select: {
          id: true,
          name: true,
          color: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: limit
  });

  // CachedArticle 형태로 변환
  return articles.map(articleForCache);
}

// 캐시된 최신 아티클 조회
const getCachedLatestArticles = unstable_cache(
  getLatestArticlesInternal,
  ['home-latest-articles'],
  {
    tags: [CacheTags.homeArticles, CacheTags.allArticles]
  }
);

// 홈페이지용 최신 아티클 조회 (3개) - 공개용
export async function getLatestArticles(
  limit: number = 3
): Promise<CachedArticle[]> {
  try {
    return await getCachedLatestArticles(limit);
  } catch (error) {
    console.error('최신 아티클 조회 실패:', error);
    return [];
  }
}

// 아티클 삭제
export async function deleteArticle(id: number) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        needsAuth: true,
        redirectTo: '/signin',
        error: '로그인이 필요합니다.'
      };
    }

    // 기존 아티클 확인 및 권한 체크
    const existingArticle = await validateArticleOwnership(id, user.id);

    // 관련 좋아요 먼저 삭제
    await prisma.like.deleteMany({
      where: {
        type: 'article',
        targetId: String(id)
      }
    });

    // 아티클 삭제
    await prisma.article.delete({
      where: { id }
    });

    // 이미지 파일도 삭제
    if (
      existingArticle.image &&
      !existingArticle.image.includes('/images/plant-default.webp') &&
      !existingArticle.image.startsWith('data:')
    ) {
      await deleteImageFromCloudflare(existingArticle.image);
    }

    console.log('아티클 삭제 완료:', { id, title: existingArticle.title });

    // 캐시 무효화
    revalidateUserCache('articleCreate', user.id);

    // 성공 결과 반환
    return {
      success: true,
      redirectTo: '/articles'
    };
  } catch (error) {
    console.error('아티클 삭제 오류:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : '아티클 삭제에 실패했습니다'
    };
  }
}
