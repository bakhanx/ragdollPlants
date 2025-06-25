'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getCurrentUser, validateArticleOwnership } from './utils/auth-helpers';

// 아티클 생성 유효성 검사 스키마
const createArticleSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다'),
  content: z.string().min(1, '내용은 필수입니다'),
  summary: z.string().optional(),
  tags: z.array(z.string()).optional(),
  categoryId: z.string().min(1, '카테고리는 필수입니다')
});

// 모든 아티클 조회 (최적화된 쿼리 직접 구현)
export async function getArticles() {
  try {
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
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('아티클 목록 조회 오류:', error);
    throw new Error('아티클 목록을 불러오는 중 오류가 발생했습니다.');
  }
}

// 특정 아티클 조회
export async function getArticleById(id: string) {
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
    const thumbnailFile = formData.get('thumbnail') as File | null;
    let thumbnailUrl = '';

    if (thumbnailFile && thumbnailFile.size > 0) {
      // 실제 구현에서는 파일 스토리지에 업로드
      // 임시로 base64 인코딩 (실제 운영에서는 Cloudflare Images 등 사용 권장)
      const bytes = await thumbnailFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      thumbnailUrl = `data:${thumbnailFile.type};base64,${base64}`;
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
        image: thumbnailUrl || null,
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
export async function updateArticle(id: string, formData: FormData) {
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

    const tagsJson = formData.get('tags') as string;
    let tags: string[] = [];
    if (tagsJson) {
      try {
        tags = JSON.parse(tagsJson);
      } catch (e) {
        console.error('태그 파싱 오류:', e);
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
        summary: validatedData.summary || undefined,
        tags: validatedData.tags || [],
        categoryId: validatedData.categoryId
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

// 아티클 삭제
export async function deleteArticle(id: string) {
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
