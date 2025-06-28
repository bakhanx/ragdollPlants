import React from 'react';
import BackgroundImage from '../_components/layout/BackgroundImage';
import { ContentsLayout } from '../_components/layout/ContentsLayout';
import { Header } from '../_components/header/Header';
import { getMyPlants } from '../actions/plants';
import { MyPlantList } from './_components';
import { PAGINATION } from '@/app/_constants/pagination';

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

  let plantsData: Awaited<ReturnType<typeof getMyPlants>> | null = null;
  let hasError = false;

  try {
    plantsData = await getMyPlants({
      page: currentPage,
      limit: PAGINATION.ITEMS_PER_PAGE,
      search: searchQuery
    });
  } catch (error) {
    console.error('식물 데이터 로딩 오류:', error);
    hasError = true;
    plantsData = null;
  }

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-05.webp" />
      <ContentsLayout>
        <Header
          title="내 식물"
          showNotification
        />

        <div className="w-full py-4">
          {/* 에러 발생 시 메시지 표시 */}
          {hasError && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-center">
              <p className="text-red-600">
                식물 데이터를 불러오는 중 오류가 발생했습니다.
              </p>
              <p className="text-sm text-red-500">
                페이지를 새로고침해 주세요.
              </p>
            </div>
          )}

          {/* 식물 목록 */}
          <MyPlantList
            plantsData={plantsData}
            currentPage={currentPage}
            searchQuery={searchQuery}
          />
        </div>
      </ContentsLayout>
    </>
  );
}
