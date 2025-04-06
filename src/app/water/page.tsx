import React from 'react';
import { myPlants } from '../_temp/constants';
import Header from '../_components/Header';
import ContentLayout from '../_components/ContentsLayout';
import BackgroundImage from '../_components/BackgroundImage';
import { WaterCardList } from './_components/WaterCardList';

// 나중에 실제 데이터 페칭 함수로 대체
async function getWateringData() {
  // 임시로 constants 데이터 사용
  const todayPlants = myPlants.filter(plant => !plant.status);
  const previousPlants = myPlants.filter(plant => plant.status).slice(0, 1);

  return {
    todayPlants,
    previousPlants,
    previousDate: 'Saturday, May 21'
  };
}

export default async function Page() {
  // 서버에서 데이터 페칭
  const { todayPlants, previousPlants, previousDate } = await getWateringData();

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-03.webp" />
      <ContentLayout>
        <Header
          title="물주기"
          showNotification
        />
        <WaterCardList
          plants={todayPlants}
          previousPlants={previousPlants}
          previousDate={previousDate}
        />
      </ContentLayout>
    </>
  );
}
