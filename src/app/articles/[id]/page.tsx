import { notFound } from 'next/navigation';
import React from 'react';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import { auth } from '@/auth';
import { USER_ROLES } from '@/lib/auth-utils';
import { checkIsAdmin } from '@/lib/auth-utils';

import { ArticleCategory } from '@/types/models/article';
import ArticleImage from '../_components/ArticleImage';
import ArticleContent from '../_components/ArticleContent';
import { getArticleById } from '@/app/actions/articles';

interface ArticleDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ArticleDetailPage({
  params
}: ArticleDetailPageProps) {
  const { id } = await params;
  const isAdmin = await checkIsAdmin();

  try {
    const article = await getArticleById(Number(id));

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
        <BackgroundImage src="/images/welcome-bg-07.webp" />
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
