import React from 'react';
import { auth } from '@/auth';

import BackgroundImage from '../_components/layout/BackgroundImage';
import { ContentsLayout } from '../_components/layout/ContentsLayout';
import { Header } from '../_components/header/Header';
import { GalleryTitleSection } from './_components/GalleryTitleSection';
import { GalleryGrid } from './_components/GalleryGrid';
import { getUserGalleries } from '../actions/galleries';

export default async function GalleriesPage() {
  const session = await auth();
  const galleries = await getUserGalleries();
  const photoCount = galleries.length;

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-06.webp" />

      <ContentsLayout
        noPadding
        showFooter={false}>
        {/* 헤더 */}
        <Header
          title="갤러리"
          showNotification
          variant="glass"
        />

        {/* 갤러리 타이틀 섹션 */}
        <GalleryTitleSection photoCount={photoCount} />

        {/* 갤러리 그리드 */}
        <GalleryGrid
          items={galleries}
          session={session}
        />
      </ContentsLayout>
    </>
  );
}
