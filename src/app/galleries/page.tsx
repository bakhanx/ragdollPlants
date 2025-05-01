import React from 'react';

import BackgroundImage from '../_components/layout/BackgroundImage';
import { ContentsLayout } from '../_components/layout/ContentsLayout';
import { Header } from '../_components/header/Header';
import { GalleryTitleSection } from './_components/GalleryTitleSection';
import { GalleryGrid } from './_components/GalleryGrid';
import { galleryItems } from '../_temp/galleryData';

export default function GalleriesPage() {
  // 등록된 사진 개수
  const photoCount = galleryItems.length;

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
        <GalleryGrid items={galleryItems} />
      </ContentsLayout>
    </>
  );
}
