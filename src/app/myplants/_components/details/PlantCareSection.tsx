'use client';

import React from 'react';
import { CareCard } from '@/app/care/_components/CareCard';
import { calculateProgressPercentage } from '@/app/_utils/dateUtils';
import Link from 'next/link';

interface PlantCareSectionProps {
  plant: {
    id: string;
    name: string;
    image: string | null;
    lastWateredDate: Date | null;
    wateringInterval: number | null;
    lastNutrientDate: Date | null;
    nutrientInterval: number | null;
  };
}

export const PlantCareSection = ({ plant }: PlantCareSectionProps) => {
  // 케어 데이터 준비
  const lastWateredStr =
    plant.lastWateredDate?.toISOString().split('T')[0] || '';
  const lastNutrientStr =
    plant.lastNutrientDate?.toISOString().split('T')[0] || '';

  const calculateNextDate = (lastDate: string, interval: number): string => {
    if (!lastDate) return '';
    const last = new Date(lastDate);
    const next = new Date(last);
    next.setDate(last.getDate() + interval);
    return next.toISOString().split('T')[0];
  };

  const wateringInterval = plant.wateringInterval || 7;
  const nutrientInterval = plant.nutrientInterval || 30;

  const waterNextDate = calculateNextDate(lastWateredStr, wateringInterval);
  const nutrientNextDate = calculateNextDate(lastNutrientStr, nutrientInterval);

  const waterProgress = lastWateredStr
    ? calculateProgressPercentage(
        lastWateredStr,
        waterNextDate,
        wateringInterval
      )
    : 0;

  const nutrientProgress = lastNutrientStr
    ? calculateProgressPercentage(
        lastNutrientStr,
        nutrientNextDate,
        nutrientInterval
      )
    : 0;

  const plantData = {
    id: plant.id,
    name: plant.name,
    image: plant.image || '/images/plant-default.png',
    waterInterval: wateringInterval,
    nutrientInterval: nutrientInterval
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
        plant={plantData}
        waterProgress={{
          lastDate: lastWateredStr,
          nextDate: waterNextDate,
          interval: wateringInterval,
          progressPercentage: waterProgress
        }}
        nutrientProgress={{
          lastDate: lastNutrientStr,
          nextDate: nutrientNextDate,
          interval: nutrientInterval,
          progressPercentage: nutrientProgress
        }}
        hideImage={true}
      />
    </div>
  );
};
