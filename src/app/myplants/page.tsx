import React from 'react';
import BackgroundImage from '../_components/layout/BackgroundImage';
import { ContentsLayout } from '../_components/layout/ContentsLayout';
import { Header } from '../_components/header/Header';
import Link from 'next/link';
import { MyPlantList } from './_components/MyPlantList';
import { LegacyMyPlant } from '@/types/models/plant';

// 임시 데이터 - 후에 실제 API 연동으로 대체
const myPlants: LegacyMyPlant[] = [
  {
    id: 1,
    name: '몬스테라',
    imageUrl: '/images/welcome-bg-01.webp',
    needsWater: true,
    needsNutrient: false,
    lastWatered: '2023-04-10',
    plantType: '실내식물'
  },
  {
    id: 2,
    name: '산세베리아',
    imageUrl: '/images/welcome-bg-02.webp',
    needsWater: false,
    needsNutrient: true,
    lastWatered: '2023-04-15',
    plantType: '다육식물'
  },
  {
    id: 3,
    name: '피쉬본 선인장',
    imageUrl: '/images/welcome-bg-03.webp',
    needsWater: false,
    needsNutrient: false,
    lastWatered: '2023-04-18',
    plantType: '선인장'
  },
  {
    id: 4,
    name: '관음죽',
    imageUrl: '/images/welcome-bg-04.webp',
    needsWater: true,
    needsNutrient: true,
    lastWatered: '2023-04-12',
    plantType: '실내식물'
  }
  // 추가 식물 데이터는 필요에 따라 확장
];

export default function MyPlantsPage() {
  // 등록된 식물 개수
  const plantCount = myPlants.length;
  // 등록 가능한 최대 식물 개수

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-05.webp" />
      <ContentsLayout>
        <Header
          title="내 식물"
          showNotification
        />

        <div className="w-full py-4">
          {/* 식물 목록 */}
          <MyPlantList initialPlants={myPlants} />

          {/* 식물이 없을 경우 메시지 */}
          {plantCount === 0 && (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg bg-gray-50 text-center">
              <p className="mb-2 text-gray-500">등록된 식물이 없습니다.</p>
              <Link
                href="/myplants/upload"
                className="rounded-full bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">
                첫 식물 등록하기
              </Link>
            </div>
          )}
        </div>
      </ContentsLayout>
    </>
  );
}
