import { Suspense } from 'react';
import BackgroundImage from '../_components/layout/BackgroundImage';
import { ContentsLayout } from '../_components/layout/ContentsLayout';
import { Header } from '../_components/header/Header';
import { UploadButton } from '../_components/common/UploadButton';
import GalleryListWrapper from './_components/GalleryListWrapper';
import GalleryCardsSkeleton from './_components/GalleryCardsSkeleton';

export default function GalleriesPage() {
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
        <div className="mt-16 w-full p-4">
          <div className="relative flex flex-col items-center">
            <div className="text-center text-white">
              <h1 className="mb-1 text-2xl font-bold sm:text-3xl">
                My Plant Gallery
              </h1>
              <p className="mb-8 text-xs opacity-80 sm:text-sm">
                내 소중한 식물들의 아름다운 순간들
              </p>
              <div className="mx-auto mb-8 h-px w-16 bg-white opacity-30"></div>
            </div>

            {/* 업로드 버튼 */}
            <div className="absolute top-0 right-0">
              <UploadButton
                link="/galleries/upload"
                title="사진 추가"
              />
            </div>
          </div>
        </div>

        {/* 갤러리 그리드 */}
        <Suspense fallback={<GalleryCardsSkeleton />}>
          <GalleryListWrapper />
        </Suspense>
      </ContentsLayout>
    </>
  );
}
