'use client';

import React from 'react';
import { CareCard } from '@/app/care/_components/CareCard';
import Link from 'next/link';
import { CachedPlant } from '@/types/cache/plant';
import type { PlantCareData } from '@/hooks/usePlantCare';

interface PlantCareSectionProps {
  plant: CachedPlant;
}

export const PlantCareSection = ({ plant }: PlantCareSectionProps) => {
  // CachedPlant 데이터를 PlantCareData 타입으로 변환
  const plantCareData: PlantCareData = {
    id: plant.id,
    name: plant.name,
    image: plant.image || '/images/plant-default.png',
    lastWateredDate: plant.lastWateredDate,
    wateringInterval: plant.wateringInterval,
    lastNutrientDate: plant.lastNutrientDate,
    nutrientInterval: plant.nutrientInterval
  };

  return (
    <div className="py-4">
      {/* 케어 페이지 이동 버튼 */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-50">식물 케어</h2>
        <Link
          href="/care"
          className="text-sm text-green-500 hover:text-green-600">
          전체 관리
        </Link>
      </div>

      {/* 케어 카드 */}
      <CareCard
        plant={plantCareData}
        hideImage={true}
      />
    </div>
  );
};
