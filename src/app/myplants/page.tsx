import { Suspense } from 'react';
import BackgroundImage from '../_components/layout/BackgroundImage';
import { ContentsLayout } from '../_components/layout/ContentsLayout';
import { Header } from '../_components/header/Header';
import { SearchInput } from '../_components/common/SearchInput';
import { UploadButton } from '../_components/common/UploadButton';
import MyPlantListWrapper from './_components/MyPlantListWrapper';
import MyPlantCardsSkeleton from './_components/MyPlantCardsSkeleton';
import { MAX_PLANTS } from '@/types/models/plant';

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
        <Header
          title="내 식물"
          showNotification
        />

        <div className="w-full py-4">
          <div className="py-8">
            {/* 검색 및 업로드 버튼 영역 */}
            <div className="mt-4 mb-6 flex justify-between">
              <div className="w-full max-w-xs">
                <SearchInput
                  placeholder="식물 이름 또는 종류 검색"
                  defaultValue={searchQuery}
                />
              </div>
              <UploadButton
                link="/myplants/upload"
                title="식물 등록"
                maxCount={MAX_PLANTS}
              />
            </div>

            {/* 식물 목록  */}
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
