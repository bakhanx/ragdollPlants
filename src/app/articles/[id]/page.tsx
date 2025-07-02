import { notFound } from 'next/navigation';
import React from 'react';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import { auth } from '@/auth';

import { ArticleCategory } from '@/types/models/article';
import ArticleImage from '../_components/ArticleImage';
import ArticleContent from '../_components/ArticleContent';
import { getArticleById } from '@/app/actions/articles';

export default async function ArticleDetail(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const { id } = params;

  const session = await auth();
  const isAdmin = session?.user?.role === 'ADMIN';
  try {
    const articleId = parseInt(id, 10);
    if (isNaN(articleId)) {
      notFound();
    }

    const article = await getArticleById(articleId);

    // ArticleContent에 전달할 형태로 변환
    const articleData = {
      title: article.title,
      author: article.author.name || '익명',
      date: article.createdAt.toISOString().split('T')[0].replace(/-/g, '.'),
      content: article.content,
      category: article.category.name as ArticleCategory,
      tags: article.tags
    };

    return (
      <>
        <BackgroundImage src="/images/welcome-bg-06.webp" />
        <ContentsLayout noPadding>
          {/* 헤더 */}
          <Header
            title={article.title}
            id={id}
            showBack
            showContentMenu={isAdmin} // 관리자에게만 메뉴 표시
            showNotification
            variant="glass"
            contentType="article"
            isOwner={isAdmin}
          />

          <div className="w-full rounded-2xl">
            {/* 이미지 */}
            <ArticleImage
              imageUrl={article.image || '/images/plant-default.png'}
              title={article.title}
              id={id}
            />

            {/* 콘텐츠 */}
            <ArticleContent article={articleData} />
          </div>
        </ContentsLayout>
      </>
    );
  } catch (error) {
    console.error('아티클 조회 오류:', error);
    notFound();
  }
}
