import React from 'react';
import BackgroundImage from '../_components/layout/BackgroundImage';
import { ContentsLayout } from '../_components/layout/ContentsLayout';
import { Header } from '../_components/header/Header';
import Link from 'next/link';
import { MyPlantList } from './_components/MyPlantList';
import { getMyPlants } from '../actions/plants';

export default async function MyPlantsPage() {
  // 실제 데이터베이스에서 식물 데이터 가져오기 (전처리 없음)
  let myPlants: Awaited<ReturnType<typeof getMyPlants>> = [];
  let hasError = false;

  try {
    // 전처리 과정 제거 - DB 데이터 직접 사용
    myPlants = await getMyPlants();
  } catch (error) {
    console.error('식물 데이터 로딩 오류:', error);
    hasError = true;
    myPlants = [];
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

          {/* 식물 목록 - 전처리 없이 직접 전달 */}
          <MyPlantList initialPlants={myPlants} />
        </div>
      </ContentsLayout>
    </>
  );
}
