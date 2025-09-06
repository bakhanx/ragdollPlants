import { Suspense } from 'react';
import BackgroundImage from '../_components/layout/BackgroundImage';
import { ContentsLayout } from '../_components/layout/ContentsLayout';
import { Header } from '../_components/header/Header';
import { GalleryGridSkeleton } from './_components/GalleryGridSkeleton';
import { GalleryGridWrapper } from './_components/GalleryGridWrapper';

// NextAuth v5 호환성 의심
export const dynamic = 'force-dynamic';

export default async function GalleriesPage() {
  return (
    <>
      <BackgroundImage src="/images/welcome-bg-06.webp" />
      <ContentsLayout
        noPadding
        showFooter={false}>
        {/* 헤더 */}
        <Header
          title="갤러리"
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
          </div>
        </div>

        {/* 갤러리 그리드 */}
        <Suspense fallback={<GalleryGridSkeleton />}>
          <GalleryGridWrapper />
        </Suspense>
      </ContentsLayout>
    </>
  );
}
