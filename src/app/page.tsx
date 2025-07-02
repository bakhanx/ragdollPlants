import React from 'react';

import { ContentsLayout } from './_components/layout/ContentsLayout';
import BackgroundImage from './_components/layout/BackgroundImage';
import Banner from './_components/banner/Banner';
import { MenuList } from './_components/lists/MenuList';
import { Header } from './_components/header/Header';
import { ArticleList } from './_components/lists/ArticleList';
import { getLatestArticles } from './actions/articles';

const ARTICLE_COUNT = 3;

export default async function Page() {
  const latestArticles = await getLatestArticles(ARTICLE_COUNT);

  return (
    <>
      {/* 배경이미지 */}
      <BackgroundImage src="/images/welcome-bg-07.webp" />

      <ContentsLayout>
        {/* 헤더 */}
        <Header showNotification />

        {/* 메뉴 리스트 */}
        <MenuList />

        {/* 배너 */}
        <Banner />

        {/* 기사 리스트 - 최신 3개 표시 */}
        <ArticleList items={latestArticles} />
      </ContentsLayout>
    </>
  );
}
