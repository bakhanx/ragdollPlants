'use client';

import React, { useState } from 'react';
import { calculateProgressPercentage } from '@/app/_utils/dateUtils';
import { CareCard } from './CareCard';
import { CareCardListProps } from '@/types/components/care';
import { LegacyMyPlantCare } from '@/types/models/care';

export const CareCardList = ({ plants: initialPlants }: CareCardListProps) => {
  const [plants, setPlants] = useState<LegacyMyPlantCare[]>(initialPlants);
  const [waterPendingUpdates, setWaterPendingUpdates] = useState<Set<string>>(
    new Set()
  );
  const [nutrientPendingUpdates, setNutrientPendingUpdates] = useState<
    Set<string>
  >(new Set());

  // 날짜 포맷 유틸리티 (YYYY-MM-DD)
  const formatDateForAPI = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 다음 케어 날짜 계산
  const calculateNextCareDate = (fromDate: Date, interval: number): string => {
    const nextDate = new Date(fromDate);
    nextDate.setDate(nextDate.getDate() + interval);
    return formatDateForAPI(nextDate);
  };

  // 물주기 상태 변경 핸들러
  const handleWaterStatusChange = async (
    plantId: string,
    newStatus: boolean
  ) => {
    // 이미 업데이트 중인 식물이면 무시
    if (waterPendingUpdates.has(plantId)) return;

    try {
      // 현재 날짜 가져오기
      const today = new Date();
      const todayFormatted = formatDateForAPI(today);

      // 기존 식물 데이터 가져오기
      const plant = plants.find(p => p.id === plantId);
      if (!plant) return;

      // 다음 물주기 날짜 계산
      const nextWateringDate = calculateNextCareDate(
        today,
        plant.waterInterval
      );

      // 1. 즉시 UI 업데이트 (Optimistic Update)
      setWaterPendingUpdates(prev => new Set(prev).add(plantId));
      setPlants(prevPlants =>
        prevPlants.map(plant =>
          plant.id === plantId
            ? {
                ...plant,
                waterStatus: newStatus,
                lastWateredDate: todayFormatted,
                nextWateringDate: nextWateringDate
              }
            : plant
        )
      );

      // 2. 서버에 업데이트 요청
      await updatePlantWateringStatus(
        plantId,
        newStatus,
        todayFormatted,
        nextWateringDate
      );

      // 3. 성공적으로 완료됨
      setWaterPendingUpdates(prev => {
        const next = new Set(prev);
        next.delete(plantId);
        return next;
      });
    } catch (error) {
      // 4. 실패 시 원래 상태로 롤백
      console.error('물주기 상태 업데이트 실패:', error);

      // 기존 식물 상태 가져오기
      const originalPlant = initialPlants.find(p => p.id === plantId);
      if (!originalPlant) return;

      setPlants(prevPlants =>
        prevPlants.map(plant =>
          plant.id === plantId
            ? {
                ...plant,
                waterStatus: !newStatus,
                lastWateredDate: originalPlant.lastWateredDate,
                nextWateringDate: originalPlant.nextWateringDate
              }
            : plant
        )
      );

      setWaterPendingUpdates(prev => {
        const next = new Set(prev);
        next.delete(plantId);
        return next;
      });
    }
  };

  // 비료주기 상태 변경 핸들러
  const handleNutrientStatusChange = async (
    plantId: string,
    newStatus: boolean
  ) => {
    // 이미 업데이트 중인 식물이면 무시
    if (nutrientPendingUpdates.has(plantId)) return;

    try {
      // 현재 날짜 가져오기
      const today = new Date();
      const todayFormatted = formatDateForAPI(today);

      // 기존 식물 데이터 가져오기
      const plant = plants.find(p => p.id === plantId);
      if (!plant) return;

      // 다음 비료주기 날짜 계산
      const nextNutrientDate = calculateNextCareDate(
        today,
        plant.nutrientInterval
      );

      // 1. 즉시 UI 업데이트 (Optimistic Update)
      setNutrientPendingUpdates(prev => new Set(prev).add(plantId));
      setPlants(prevPlants =>
        prevPlants.map(plant =>
          plant.id === plantId
            ? {
                ...plant,
                nutrientStatus: newStatus,
                lastNutrientDate: todayFormatted,
                nextNutrientDate: nextNutrientDate
              }
            : plant
        )
      );

      // 2. 서버에 업데이트 요청
      await updatePlantNutrientStatus(
        plantId,
        newStatus,
        todayFormatted,
        nextNutrientDate
      );

      // 3. 성공적으로 완료됨
      setNutrientPendingUpdates(prev => {
        const next = new Set(prev);
        next.delete(plantId);
        return next;
      });
    } catch (error) {
      // 4. 실패 시 원래 상태로 롤백
      console.error('비료주기 상태 업데이트 실패:', error);

      // 기존 식물 상태 가져오기
      const originalPlant = initialPlants.find(p => p.id === plantId);
      if (!originalPlant) return;

      setPlants(prevPlants =>
        prevPlants.map(plant =>
          plant.id === plantId
            ? {
                ...plant,
                nutrientStatus: !newStatus,
                lastNutrientDate: originalPlant.lastNutrientDate,
                nextNutrientDate: originalPlant.nextNutrientDate
              }
            : plant
        )
      );

      setNutrientPendingUpdates(prev => {
        const next = new Set(prev);
        next.delete(plantId);
        return next;
      });
    }
  };

  // 실제 API 호출 함수 (예시)
  const updatePlantWateringStatus = async (
    plantId: string,
    status: boolean,
    lastWateredDate: string,
    nextWateringDate: string
  ) => {
    // API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 실제로는 이런 식으로 API를 호출할 것입니다
    // const response = await fetch(`/api/plants/${plantId}/water`, {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     status,
    //     lastWateredDate,
    //     nextWateringDate
    //   }),
    // });
    // if (!response.ok) throw new Error('Failed to update watering status');
  };

  const updatePlantNutrientStatus = async (
    plantId: string,
    status: boolean,
    lastNutrientDate: string,
    nextNutrientDate: string
  ) => {
    // API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 실제로는 이런 식으로 API를 호출할 것입니다
    // const response = await fetch(`/api/plants/${plantId}/nutrient`, {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     status,
    //     lastNutrientDate,
    //     nextNutrientDate
    //   }),
    // });
    // if (!response.ok) throw new Error('Failed to update nutrient status');
  };

  return (
    <div className="flex w-full flex-col gap-4 py-4">
      {plants.map(plant => {
        // 물주기 진행률 계산
        const waterProgressPercentage = calculateProgressPercentage(
          plant.lastWateredDate,
          plant.nextWateringDate,
          plant.waterInterval
        );

        // 비료주기 진행률 계산
        const nutrientProgressPercentage = calculateProgressPercentage(
          plant.lastNutrientDate,
          plant.nextNutrientDate,
          plant.nutrientInterval
        );

        return (
          <CareCard
            key={plant.id}
            plant={plant}
            waterProgress={{
              lastDate: plant.lastWateredDate,
              nextDate: plant.nextWateringDate,
              interval: plant.waterInterval,
              progressPercentage: waterProgressPercentage
            }}
            nutrientProgress={{
              lastDate: plant.lastNutrientDate,
              nextDate: plant.nextNutrientDate,
              interval: plant.nutrientInterval,
              progressPercentage: nutrientProgressPercentage
            }}
            onWaterClick={handleWaterStatusChange}
            onNutrientClick={handleNutrientStatusChange}
            isWaterUpdating={waterPendingUpdates.has(plant.id)}
            isNutrientUpdating={nutrientPendingUpdates.has(plant.id)}
          />
        );
      })}
    </div>
  );
};
