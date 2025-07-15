import React, { Suspense } from 'react';

import { ContentsLayout } from './_components/layout/ContentsLayout';
import BackgroundImage from './_components/layout/BackgroundImage';
import { BannerWrapper } from './_components/banner/BannerWrapper';
import { BannerSkeleton } from './_components/banner/BannerSkeleton';
import { MenuList } from './_components/lists/MenuList';
import { Header } from './_components/header/Header';
import { ArticleListWrapper } from './_components/lists/ArticleListWrapper';
import { ArticleListSkeleton } from './_components/lists/ArticleListSkeleton';
import { getCurrentUser } from '@/lib/auth-utils';

export default async function Page() {
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
        <Suspense fallback={<BannerSkeleton />}>
          <BannerWrapper />
        </Suspense>

        {/* 기사 리스트 - 최신 3개 표시 */}
        <Suspense fallback={<ArticleListSkeleton />}>
          <ArticleListWrapper />
        </Suspense>
      </ContentsLayout>
    </>
  );
}
