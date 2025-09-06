import { Suspense } from 'react';
import BackgroundImage from '../_components/layout/BackgroundImage';
import { ContentsLayout } from '../_components/layout/ContentsLayout';
import { Header } from '../_components/header/Header';
import { SearchInputWithNavigation } from '../_components/common/SearchInputWithNavigation';
import MyPlantListWrapper from './_components/MyPlantListWrapper';
import MyPlantCardsSkeleton from './_components/MyPlantCardsSkeleton';

interface MyPlantsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function MyPlantsPage({
  searchParams
}: MyPlantsPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const searchQuery = params.search || '';

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-05.webp" />
      <ContentsLayout>
        <Header title="내 식물" />

        <div className="w-full py-4">
          <div className="py-2">
            {/* 검색 */}
            <div className="mt-3 mb-6">
              <div className="w-full max-w-xs">
                <SearchInputWithNavigation
                  placeholder="식물 이름 또는 종류 검색"
                  defaultValue={searchQuery}
                  basePath="/myplants"
                />
              </div>
            </div>

            {/* 식물 목록 */}
            <Suspense fallback={<MyPlantCardsSkeleton />}>
              <MyPlantListWrapper
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
