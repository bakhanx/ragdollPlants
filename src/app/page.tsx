import React from 'react';

import { ContentsLayout } from './_components/layout/ContentsLayout';
import BackgroundImage from './_components/layout/BackgroundImage';
import Banner from './_components/banner/Banner';
import { MenuList } from './_components/lists/MenuList';
import { Header } from './_components/header/Header';
import { ArticleList } from './_components/lists/ArticleList';
import { getLatestArticles } from './actions/articles';
import { getActiveEventsForBanner } from './actions/events';
import { getCurrentUser } from '@/lib/auth-utils';

const ARTICLE_COUNT = 3;
const BANNER_EVENT_COUNT = 3;

export default async function Page() {
  const [latestArticles, activeEvents] = await Promise.all([
    getLatestArticles(ARTICLE_COUNT),
    getActiveEventsForBanner(BANNER_EVENT_COUNT)
  ]);
  const currentUser = await getCurrentUser();
  return (
    <>
      {/* 배경이미지 */}
      <BackgroundImage src="/images/welcome-bg-07.webp" />

      <ContentsLayout>
        {/* 헤더 */}
        <Header showNotification />

        {/* 메뉴 리스트 */}
        <MenuList userId={currentUser?.id} currentUserId={currentUser?.id} isOwner={true} />

        {/* 배너 */}
        <Banner events={activeEvents} />

        {/* 기사 리스트 - 최신 3개 표시 */}
        <ArticleList items={latestArticles} />
      </ContentsLayout>
    </>
  );
}
