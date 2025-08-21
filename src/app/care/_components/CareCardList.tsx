'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CareCard } from './CareCard';
import { CareResponse } from '@/types/cache/care';

interface CareCardListProps {
  initialData: CareResponse | null;
  isLoggedIn: boolean;
}

export const CareCardList = ({ initialData, isLoggedIn }: CareCardListProps) => {
  const router = useRouter();

  // 페이지 방문 시 날짜 변경 체크
  useEffect(() => {
    const STORAGE_KEY = 'care_page_date_check';
    const today = new Date().toDateString();
    const lastCheck = localStorage.getItem(STORAGE_KEY);

    if (lastCheck && lastCheck !== today) {
      // 날짜가 바뀜 - 캐시 무효화를 위한 새로고침
      localStorage.setItem(STORAGE_KEY, today);
      router.refresh();
    } else if (!lastCheck) {
      // 첫 방문
      localStorage.setItem(STORAGE_KEY, today);
    }
  }, [router]);
  if (!initialData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 text-red-400">
          <svg
            className="mx-auto mb-4 h-16 w-16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          데이터를 불러올 수 없어요
        </h3>
        <p className="mb-6 text-gray-500">페이지를 새로고침해 주세요.</p>
      </div>
    );
  }

  const plants = initialData;

  if (plants.length === 0) {
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
        <Link
          href="/myplants/upload"
          className="rounded-lg bg-green-600 px-6 py-2 text-white transition-colors hover:bg-green-700">
          식물 등록하기
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-10">
      {plants.map(plant => (
        <CareCard
          key={plant.id}
          plant={{
            id: plant.id,
            name: plant.name,
            image: plant.image,
            lastWateredDate: plant.lastWateredDate,
            wateringInterval: plant.waterInterval,
            lastNutrientDate: plant.lastNutrientDate,
            nutrientInterval: plant.nutrientInterval
          }}
          isLoggedIn={isLoggedIn}
        />
      ))}
    </div>
  );
};
