import React from 'react';
import { myPlants } from '../_temp';
import { Header } from '../_components/header/Header';
import { ContentsLayout } from '../_components/layout/ContentsLayout';
import BackgroundImage from '../_components/layout/BackgroundImage';
import { CareCardList } from './_components/CareCardList';
import { getUserPlantsForCare } from '../actions/care';
import { getCurrentUser } from '@/lib/auth-utils';

// 실제 데이터 페칭 함수
async function getCarePlantsData() {
  try {
    const user = await getCurrentUser();
    
    // 인증된 사용자가 있으면 실제 데이터를 가져오고, 없으면 임시 데이터 사용
    if (user?.id) {
      const plants = await getUserPlantsForCare();
      return plants;
    } else {
      // 비인증 사용자를 위한 임시 데이터
      const plants = [...myPlants].sort((a, b) => {
        const dateA = new Date(a.nextWateringDate);
        const dateB = new Date(b.nextWateringDate);
        return dateA.getTime() - dateB.getTime();
      });
      return plants;
    }
  } catch (error) {
    console.error('케어 식물 데이터 조회 오류:', error);
    // 오류 발생 시 임시 데이터 반환
    const plants = [...myPlants].sort((a, b) => {
      const dateA = new Date(a.nextWateringDate);
      const dateB = new Date(b.nextWateringDate);
      return dateA.getTime() - dateB.getTime();
    });
    return plants;
  }
}

export default async function Page() {
  // 서버에서 데이터 페칭
  const plants = await getCarePlantsData();

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-03.webp" />
      <ContentsLayout>
        <Header
          title="식물 케어"
          showNotification
        />

        <CareCardList plants={plants} />
      </ContentsLayout>
    </>
  );
}
