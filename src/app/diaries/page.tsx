import { Suspense } from 'react';
import BackgroundImage from '../_components/layout/BackgroundImage';
import { ContentsLayout } from '../_components/layout/ContentsLayout';
import { Header } from '../_components/header/Header';
import { SearchInputWithNavigation } from '../_components/common/SearchInputWithNavigation';
import DiaryListWrapper from './_components/DiaryListWrapper';
import DiaryCardsSkeleton from './_components/DiaryCardsSkeleton';

interface DiariesPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function DiariesPage({ searchParams }: DiariesPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const searchQuery = params.search || '';

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-06.webp" />
      <ContentsLayout>
        <Header
          title="식물 일기"
          showNotification
        />

        <div className="w-full py-4">
          <div className="py-2">
            {/* 검색 */}
            <div className="mt-3 mb-6">
              <div className="w-full max-w-xs">
                <SearchInputWithNavigation
                  placeholder="일기 제목 검색"
                  defaultValue={searchQuery}
                  basePath="/diaries"
                />
              </div>
            </div>

            {/* 다이어리 목록 */}
            <Suspense fallback={<DiaryCardsSkeleton />}>
              <DiaryListWrapper
                currentPage={currentPage}
                searchQuery={searchQuery}
              />
            </Suspense>
          </div>
        </div>
      </ContentsLayout>
    </>
  );
}
