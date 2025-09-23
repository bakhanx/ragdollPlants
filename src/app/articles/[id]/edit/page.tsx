import React from 'react';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import ArticleUploadForm from '@/app/articles/upload/_components/ArticleUploadForm';
import { notFound } from 'next/navigation';
import { getArticleById } from '@/app/actions/articles';

interface EditArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditArticlePage({
  params
}: EditArticlePageProps) {
  const { id } = await params;

  // ID를 숫자로 변환
  const articleId = parseInt(id, 10);
  if (isNaN(articleId)) {
    notFound();
  }

  // 아티클 데이터 가져오기
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
}
