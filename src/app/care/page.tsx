import React from 'react';
import { myPlants } from '../_temp/constants';
import Header from '../_components/layout/Header';
import ContentLayout from '../_components/layout/ContentsLayout';
import BackgroundImage from '../_components/layout/BackgroundImage';
import CareCardList from './_components/CareCardList';

// 나중에 실제 데이터 페칭 함수로 대체
async function getCarePlantsData() {
  // 임시로 constants 데이터 사용
  // 실제 서비스에서는 API를 통해 데이터를 가져옴

  // 데이터 변환 및 정렬 (물주기가 필요한 날짜가 가까운 순)

  const plants = [...myPlants].sort((a, b) => {
    const dateA = new Date(a.nextWateringDate);
    const dateB = new Date(b.nextWateringDate);
    return dateA.getTime() - dateB.getTime();
  });

  return plants;
}

export default async function Page() {
  // 서버에서 데이터 페칭
  const plants = await getCarePlantsData();

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-03.webp" />
      <ContentLayout>
        <Header
          title="식물 케어"
          showNotification
        />

        <CareCardList plants={plants} />
      </ContentLayout>
    </>
  );
}
