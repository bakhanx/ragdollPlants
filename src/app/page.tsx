import React from 'react';

import ContentLayout from './_components/layout/ContentsLayout';
import BackgroundImage from './_components/layout/BackgroundImage';
import Banner from './_components/layout/Banner';
import { MenuList } from './_components/lists/MenuList';
import Header from './_components/layout/Header';
import { ArticleList } from './_components/lists/ArticleList';
import { articleItems } from './_temp';

export default function Page() {
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

        {/* 기사 리스트 */}
        <ArticleList items={articleItems} />
      </ContentLayout>
    </>
  );
}
