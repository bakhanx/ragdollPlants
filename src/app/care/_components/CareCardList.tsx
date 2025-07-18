'use client';

import React from 'react';
import { CareCard } from './CareCard';
import { CareCardListProps } from '@/types/components/care';

export const CareCardList = ({ plants: initialPlants }: CareCardListProps) => {
  // 빈 상태 처리
  if (initialPlants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 text-gray-400">
          <svg
            className="mx-auto mb-4 h-16 w-16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          아직 등록된 식물이 없어요
        </h3>
        <p className="mb-6 text-gray-500">
          첫 번째 식물을 등록하고 케어를 시작해보세요!
        </p>
        <button className="rounded-lg bg-green-600 px-6 py-2 text-white transition-colors hover:bg-green-700">
          식물 등록하기
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-10">
      {initialPlants.map(plant => (
        <CareCard
          key={plant.id}
          plant={{
            id: plant.id,
            name: plant.name,
            image: plant.image,
            lastWateredDate: plant.lastWateredDate
              ? new Date(plant.lastWateredDate)
              : null,
            wateringInterval: plant.waterInterval,
            lastNutrientDate: plant.lastNutrientDate
              ? new Date(plant.lastNutrientDate)
              : null,
            nutrientInterval: plant.nutrientInterval
          }}
        />
      ))}
    </div>
  );
};
