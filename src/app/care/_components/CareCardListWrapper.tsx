import React from 'react';
import { CareCardList } from './CareCardList';
import { getUserPlantsForCare } from '@/app/actions/care';
import { getCurrentUser } from '@/lib/auth-utils';

// 실제 데이터 페칭 함수
async function getCarePlantsData() {
  try {
    const user = await getCurrentUser();
    
    // 인증된 사용자만 데이터 조회
    if (user?.id) {
      const plants = await getUserPlantsForCare();
      return plants;
    } else {
      // 비인증 사용자는 빈 배열 반환
      return [];
    }
  } catch (error) {
    console.error('케어 식물 데이터 조회 오류:', error);
    // 오류 발생 시 빈 배열 반환
    return [];
  }
}

export async function CareCardListWrapper() {
  const plants = await getCarePlantsData();
  return <CareCardList plants={plants} />;
}