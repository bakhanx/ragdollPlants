import React from 'react';

import ContentLayout from './_components/layout/ContentsLayout';
import BackgroundImage from './_components/layout/BackgroundImage';
import Banner from './_components/layout/Banner';
import { MenuList } from './_components/lists/MenuList';
import Header from './_components/layout/Header';
import { ArticleList } from './_components/lists/ArticleList';
import { articleItems } from './_temp/articleData';
import Link from 'next/link';

export default function Page() {
  // 최신 3개의 아티클만 선택
  const latestArticles = articleItems
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)
    .map(article => ({
      id: String(article.id), // ArticleList 컴포넌트가 string id를 기대하므로 변환
      title: article.title,
      image: article.image,
      date: article.date
    }));

  return (
    <>
      {/* 배경이미지 */}
      <BackgroundImage
        src="/images/welcome-bg-07.webp"
        overlay={true}
      />

      <ContentLayout>
        {/* 헤더 */}
        <Header showNotification />

        {/* 메뉴 리스트 */}
        <MenuList />

        {/* 배너 */}
        <Banner />

        {/* 기사 리스트 - 최신 3개 표시 */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="py-2 text-lg font-bold">최신 기사</h2>
            <Link href="/articles" className="text-sm text-green-700 hover:text-green-500 hover:underline">
              더보기
            </Link>
          </div>
          <ArticleList items={latestArticles} />
        </div>
      </ContentLayout>
    </>
  );
}
