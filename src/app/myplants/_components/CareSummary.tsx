import React from 'react';
import Link from 'next/link';
import { WaterIcon, NutrientIcon } from '@/app/_components/icons/Icons';
import { formatDateKorean, getDaysRemaining } from '@/app/_utils/dateUtils';
import { CareCard } from '@/app/care/_components/CareCard';

export interface Plant {
  id: string;
  name: string;
  image: string;
  isNew?: boolean;
  description?: string;
  category?: string;
  status?: boolean;
  waterStatus?: boolean;
  nutrientStatus?: boolean;
  waterAmount?: number;
  lastWateredDate?: string;
  nextWateringDate?: string;
  waterInterval?: number;
  lastNutrientDate?: string;
  nextNutrientDate?: string;
  nutrientInterval?: number;
  temperature?: number;
  humidity?: number;
  sunlight?: string;
  // 상세 정보
  plantType?: string;
  location?: string;
  acquiredDate?: string;
  notes?: string;
  needsWater?: boolean;
  needsNutrient?: boolean;
}

interface CareSummaryProps {
  id: number;
  lastWatered: string;
  wateringCycle: number;
  lastFertilized: string;
  fertilizerCycle: number;
  notes?: string;
}

export interface CareProgress {
  lastDate: string;
  nextDate: string;
  interval: number;
  progressPercentage: number;
}

export const CareSummary = ({
  id,
  lastWatered,
  wateringCycle,
  lastFertilized,
  fertilizerCycle,
  notes
}: CareSummaryProps) => {
  const waterDaysRemaining = getDaysRemaining(lastWatered, wateringCycle);
  const nutrientDaysRemaining = getDaysRemaining(
    lastFertilized,
    fertilizerCycle
  );

  return (
    <div className="py-4">
      <h2 className="mb-3 text-lg font-semibold text-gray-50">식물 케어</h2>

      <div className="mb-3 flex items-center justify-between rounded-lg bg-blue-50 p-3">
        <div className="flex items-center">
          <div className="mr-3 rounded-full bg-blue-100 p-2">
            <WaterIcon
              size={20}
              className="text-blue-600"
            />
          </div>
          <div>
            <h3 className="font-medium">물주기</h3>
            <p className="text-sm text-gray-600">
              마지막: {formatDateKorean(lastWatered)}
            </p>
          </div>
        </div>
        <div className="text-right">
          {waterDaysRemaining <= 0 ? (
            <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
              물주기 필요
            </span>
          ) : (
            <span className="text-sm text-gray-600">
              {waterDaysRemaining}일 후
            </span>
          )}
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between rounded-lg bg-amber-50 p-3">
        <div className="flex items-center">
          <div className="mr-3 rounded-full bg-amber-100 p-2">
            <NutrientIcon
              size={20}
              className="text-amber-600"
            />
          </div>
          <div>
            <h3 className="font-medium">영양제</h3>
            <p className="text-sm text-gray-600">
              마지막: {formatDateKorean(lastFertilized)}
            </p>
          </div>
        </div>
        <div className="text-right">
          {nutrientDaysRemaining <= 0 ? (
            <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
              영양제 필요
            </span>
          ) : (
            <span className="text-sm text-gray-600">
              {nutrientDaysRemaining}일 후
            </span>
          )}
        </div>
      </div>

      {notes && (
        <div className="rounded-lg bg-gray-50 p-3">
          <h3 className="mb-1 font-medium">메모</h3>
          <p className="text-sm text-gray-600">{notes}</p>
        </div>
      )}

      <div className="mt-3 flex justify-end">
        <Link
          href={`/myplants/${id}/care`}
          className="rounded-md bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700">
          케어 관리
        </Link>
      </div>
    </div>
  );
};

export interface Diary {
  id: string;
  date: string;
  title: string;
  hasImage?: boolean;
  excerpt?: string;
  content?: string;
  imageUrl?: string;
  status?: string; // DiaryMoodStatus 등
  authorName?: string;
}
