import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { ARTICLE_DATA } from '@/app/_constants/articleData';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    // 관리자 권한 확인
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다' }, { status: 403 });
    }

    // 카테고리 확인 및 생성
    const categories = ['GUIDE', 'TIPS'];
    for (const categoryId of categories) {
      await prisma.category.upsert({
        where: { id: categoryId },
        update: {},
        create: {
          id: categoryId,
          name: categoryId === 'GUIDE' ? '관리 가이드' : '식물 정보',
          description: categoryId === 'GUIDE' ? '식물 관리 방법과 팁' : '다양한 식물 정보',
          color: categoryId === 'GUIDE' ? '#10B981' : '#3B82F6',
          icon: categoryId === 'GUIDE' ? '🌱' : '📚',
          order: categoryId === 'GUIDE' ? 1 : 2,
        }
      });
    }

    // 아티클 데이터 업로드
    let uploadedCount = 0;
    
    for (const articleData of ARTICLE_DATA) {
      // 중복 확인 (제목으로)
      const existingArticle = await prisma.article.findFirst({
        where: { title: articleData.title }
      });

      if (!existingArticle) {
        await prisma.article.create({
          data: {
            title: articleData.title,
            content: articleData.content,
            summary: articleData.summary,
            image: articleData.image,
            tags: articleData.tags,
            categoryId: articleData.categoryId,
            authorId: session.user.id,
            isPublished: true,
            isActive: true,
          }
        });
        uploadedCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      count: uploadedCount,
      message: `${uploadedCount}개의 아티클이 업로드되었습니다.`
    });

  } catch (error) {
    console.error('아티클 업로드 오류:', error);
    return NextResponse.json(
      { error: '아티클 업로드 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}