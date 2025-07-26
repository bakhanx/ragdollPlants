'use client';

import React, { useEffect, useState } from 'react';
import { CareCard } from './CareCard';
import { getUserPlantsForCare } from '@/app/actions/care';
import type { LegacyMyPlantCare } from '@/types/models/care';

export const CareCardList = () => {
  const [plants, setPlants] = useState<LegacyMyPlantCare[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const plantsData = await getUserPlantsForCare();
        setPlants(plantsData);
      } catch (error) {
        console.error('케어 식물 데이터 조회 오류:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlants();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4 py-10">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white/10 rounded-lg h-32" />
        ))}
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-red-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">데이터를 불러올 수 없어요</h3>
        <p className="text-gray-500 mb-6">페이지를 새로고침해 주세요.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          새로고침
        </button>
      </div>
    );
  }

  if (plants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">아직 등록된 식물이 없어요</h3>
        <p className="text-gray-500 mb-6">첫 번째 식물을 등록하고 케어를 시작해보세요!</p>
        <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          식물 등록하기
        </button>
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
            lastWateredDate: plant.lastWateredDate ? new Date(plant.lastWateredDate) : null,
            wateringInterval: plant.waterInterval,
            lastNutrientDate: plant.lastNutrientDate ? new Date(plant.lastNutrientDate) : null,
            nutrientInterval: plant.nutrientInterval
          }}
        />
      ))}
    </div>
  );
};