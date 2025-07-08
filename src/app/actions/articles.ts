'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getCurrentUser, validateArticleOwnership } from '@/lib/auth-utils';
import {
  uploadImageToCloudflare,
  deleteImageFromCloudflare
} from '@/lib/cloudflare-images';
import { ArticleWithNumberId, ArticleCategory } from '@/types/models/article';

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

// 모든 아티클 조회 (최적화된 쿼리 직접 구현)
export async function getArticles(): Promise<ArticleWithNumberId[]> {
  try {
    const articles = await prisma.article.findMany({
      where: { isPublished: true },
      include: {
        author: {
          select: {
            id: true,
            name: true
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

    // DB 데이터를 ArticleWithNumberId 형태로 변환
    return articles.map(article => ({
      id: article.id,
      title: article.title,
      content: '', // 목록에서는 content 불필요
      image: article.image || '/images/plant-default.png',
      date: article.createdAt.toISOString().split('T')[0].replace(/-/g, '.'),
      summary: article.summary || undefined,
      author: {
        id: article.author.id,
        name: article.author.name || '익명'
      },
      tags: article.tags,
      category: article.category.name as ArticleCategory,
      likes: 0 // 임시값 (현재 스키마에 likes 테이블이 없음)
    }));
  } catch (error) {
    console.error('아티클 조회 실패:', error);
    return [];
  }
}

// 특정 아티클 조회
export async function getArticleById(id: number) {
  try {
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

    if (!article) {
      throw new Error('아티클을 찾을 수 없습니다.');
    }

    // 조회수 증가
    await prisma.article.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1
        }
      }
    });

    return article;
  } catch (error) {
    console.error('아티클 조회 오류:', error);
    throw error;
  }
}

// 아티클 생성
export async function createArticle(formData: FormData) {
  try {
    const user = await getCurrentUser();

    // FormData에서 데이터 추출
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
    let thumbnailUrl = '/images/plant-default.png';
    const thumbnailFile = formData.get('thumbnail') as File | null;

    if (thumbnailFile && thumbnailFile.size > 0) {
      thumbnailUrl = await uploadImageToCloudflare(thumbnailFile);
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

    // 캐시 재검증
    revalidatePath('/articles');

    // 생성된 아티클 페이지로 리다이렉트
    redirect(`/articles/${article.id}`);
  } catch (error) {
    console.error('아티클 생성 오류:', error);
    throw error;
  }
}

// 아티클 수정
export async function updateArticle(id: number, formData: FormData) {
  try {
    const user = await getCurrentUser();

    // 기존 아티클 확인 및 권한 체크
    const existingArticle = await validateArticleOwnership(id, user.id);

    // FormData에서 데이터 추출 (createArticle과 동일한 로직)
    const rawData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      summary: formData.get('summary') as string,
      categoryId: formData.get('categoryId') as string
    };

    // 디버깅: content가 제대로 전달되는지 확인
    console.log('updateArticle - 전달받은 content:', rawData.content);

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
    let thumbnailUrl = existingArticle.image || '/images/plant-default.png';
    const thumbnailFile = formData.get('thumbnail') as File | null;

    if (thumbnailFile && thumbnailFile.size > 0) {
      // 새 이미지 업로드
      thumbnailUrl = await uploadImageToCloudflare(thumbnailFile);

      // 기존 이미지 삭제 (기본 이미지가 아닌 경우)
      if (
        existingArticle.image &&
        !existingArticle.image.includes('/images/plant-default.png')
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

    // 캐시 재검증
    revalidatePath('/articles');
    revalidatePath(`/articles/${id}`);

    // 수정된 아티클 페이지로 리다이렉트
    redirect(`/articles/${id}`);
  } catch (error) {
    console.error('아티클 수정 오류:', error);
    throw error;
  }
}

// 홈페이지용 최신 아티클 조회 (3개)
export async function getLatestArticles(
  limit: number = 3
): Promise<ArticleWithNumberId[]> {
  try {
    const articles = await prisma.article.findMany({
      where: { isPublished: true },
      include: {
        author: {
          select: {
            id: true,
            name: true
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

    // DB 데이터를 ArticleWithNumberId 형태로 변환
    return articles.map(article => ({
      id: article.id,
      title: article.title,
      content: '', // 목록에서는 content 불필요
      image: article.image || '/images/plant-default.png',
      date: article.createdAt.toISOString().split('T')[0].replace(/-/g, '.'),
      summary: article.summary || undefined,
      author: {
        id: article.author.id,
        name: article.author.name || '익명'
      },
      tags: article.tags,
      category: article.category.name as ArticleCategory,
      likes: 0 // 임시값 (현재 스키마에 likes 테이블이 없음)
    }));
  } catch (error) {
    console.error('최신 아티클 조회 실패:', error);
    return [];
  }
}

// 아티클 삭제
export async function deleteArticle(id: number) {
  try {
    const user = await getCurrentUser();

    // 기존 아티클 확인 및 권한 체크
    const existingArticle = await validateArticleOwnership(id, user.id);

    // 아티클 삭제
    await prisma.article.delete({
      where: { id }
    });

    console.log('아티클 삭제 완료:', { id });

    // 캐시 재검증
    revalidatePath('/articles');

    // 아티클 목록으로 리다이렉트
    redirect('/articles');
  } catch (error) {
    console.error('아티클 삭제 오류:', error);
    throw error;
  }
}
