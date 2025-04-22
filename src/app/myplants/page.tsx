import React from 'react';
import BackgroundImage from '../_components/layout/BackgroundImage';
import ContentLayout from '../_components/layout/ContentsLayout';
import Header from '../_components/layout/Header';
import Link from 'next/link';
import Image from 'next/image';
import { WaterIcon, NutrientIcon } from '../_components/icons/Icons';
import UploadButton from '../_components/common/UploadButton';

// 임시 데이터 - 후에 실제 API 연동으로 대체
const myPlants = [
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
  const maxPlants = 20;

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-05.webp" />
      <ContentLayout>
        <Header
          title="내 식물"
          showNotification
        />

        <div className="w-full py-4">
          {/* 식물 등록 상태 */}
          <div className="mb-4 flex items-center justify-between rounded-lg border-2 border-gray-50 p-3 text-gray-200">
            <span className="text-sm">
              등록된 식물: <span className="font-bold">{plantCount}</span>
              <span> / {maxPlants}</span>
            </span>
            {plantCount < maxPlants && (
              <Link
                href="/myplants/register"
                className="rounded-full bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700">
                식물 등록
              </Link>
            )}
          </div>

          {/* 식물 목록 */}
          <div className="grid grid-cols-2 gap-3">
            {myPlants.map(plant => (
              <Link
                href={`/myplants/${plant.id}`}
                key={plant.id}
                className="relative flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg">
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={plant.imageUrl}
                    alt={plant.name}
                    fill
                    className="object-cover filter brightness-80 hover:brightness-100 transition-all duration-200"
                  />
                  {/* 물/영양 아이콘 */}
                  <div className="absolute top-2 right-2 flex gap-x-2 space-y-1">
                    {plant.needsWater && (
                      <div className="rounded-full bg-blue-100 p-1.5">
                        <WaterIcon
                          size={16}
                          className="[&_path]:fill-blue-600"
                        />
                      </div>
                    )}
                    {plant.needsNutrient && (
                      <div className="rounded-full bg-amber-100 p-1.5">
                        <NutrientIcon
                          size={16}
                          className="[&_path]:fill-amber-600"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-2">
                  <h3 className="font-medium text-gray-900">{plant.name}</h3>
                  <p className="text-xs text-gray-500">{plant.plantType}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* 식물이 없을 경우 메시지 */}
          {plantCount === 0 && (
            <div className="flex h-40 flex-col items-center justify-center rounded-lg bg-gray-50 text-center">
              <p className="mb-2 text-gray-500">등록된 식물이 없습니다.</p>
              <Link
                href="/myplants/register"
                className="rounded-full bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">
                첫 식물 등록하기
              </Link>
            </div>
          )}
        </div>
      </ContentLayout>

      {/* 식물 등록 버튼 (아직 최대 식물 수에 도달하지 않은 경우만 표시) */}
      {plantCount < maxPlants && <UploadButton link="/myplants/register" />}
    </>
  );
}
