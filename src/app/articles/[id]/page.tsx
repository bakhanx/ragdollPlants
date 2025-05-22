import { notFound } from 'next/navigation';
import React from 'react';
import { articleItems } from '@/app/_temp';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import ArticleImage from '../_components/ArticleImage';
import ArticleContent from '../_components/ArticleContent';

export default async function ArticleDetail(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const { id } = params;
  // 문자열 ID를 숫자로 변환
  const numericId = parseInt(id, 10);

  // 해당 id의 아티클 찾기
  const article = articleItems.find(item => item.id === numericId);

  if (!article) {
    notFound();
  }

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-06.webp" />
      <ContentsLayout noPadding>
        {/* 헤더 */}
        <Header
          title={article.title}
          id={id}
          showBack
          showMenuButton
          showNotification
          variant="glass"
          contentType="article"
        />

        <div className="w-full overflow-hidden rounded-2xl">
          {/* 이미지 */}
          <ArticleImage 
            imageUrl={article.image}
            title={article.title}
            id={id}
          />

          {/* 콘텐츠 */}
          <ArticleContent article={article} />
        </div>
      </ContentsLayout>
    </>
  );
}
