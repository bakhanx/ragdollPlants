import React from 'react';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import ArticleUploadForm from '@/app/articles/upload/_components/ArticleUploadForm';
import { notFound } from 'next/navigation';
import { getArticleById } from '@/app/actions/articles';
import { auth } from '@/auth';

interface EditArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditArticlePage({
  params
}: EditArticlePageProps) {
  try {
    const { id } = await params;

    // 관리자 권한 체크
    const session = await auth();
    const isAdmin = session?.user?.role === 'ADMIN';

    if (!isAdmin) {
      notFound(); // 관리자가 아니면 404
    }

    // ID를 숫자로 변환
    const articleId = parseInt(id, 10);
    if (isNaN(articleId)) {
      notFound();
    }

    const article = await getArticleById(articleId);

    // ArticleUploadForm에 맞는 형태로 데이터 변환
    const articleData = {
      id: article.id,
      title: article.title,
      content: article.content,
      summary: article.summary || undefined,
      tags: article.tags,
      image: article.image || undefined,
      category: {
        id: article.category.id,
        name: article.category.name
      }
    };

    return (
      <>
        <BackgroundImage src="/images/welcome-bg-03.webp" />
        <ContentsLayout>
          <Header
            title="아티클 수정"
            showBack
          />

          <ArticleUploadForm
            mode="edit"
            initialData={articleData}
          />
        </ContentsLayout>
      </>
    );
  } catch (error) {
    console.error('아티클 정보 로딩 오류:', error);
    notFound();
  }
}
