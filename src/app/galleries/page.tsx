import React from 'react';

import BackgroundImage from '../_components/layout/BackgroundImage';
import ContentLayout from '../_components/layout/ContentsLayout';
import Header from '../_components/layout/Header';
import PlantCard from './_components/PlantCard';
import FloatingButton from '@/app/_components/common/UploadButton';

export default function Page() {
  return (
    <>
      <BackgroundImage src="/images/welcome-bg-06.webp" />
      {/* Contents */}
      <ContentLayout>
        {/* 헤더 */}
        <Header />

        {/* 식물 카드 부분 */}
        <PlantCard />
        <PlantCard />
        <PlantCard />
        
      </ContentLayout>

      {/* 게시글 등록 버튼 */}

      <FloatingButton link="/myplants/upload" />
    </>
  );
}
