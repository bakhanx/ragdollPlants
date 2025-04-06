'use client';

import React, { useState } from 'react';
import { WaterCard } from './WaterCard';

interface Plant {
  id: string; // 식별자 추가
  name: string;
  image: string;
  status: boolean;
}

interface WaterCardListProps {
  plants: Plant[];
  previousPlants?: Plant[];
  previousDate?: string;
}

export const WaterCardList = ({
  plants: initialPlants,
  previousPlants = [],
  previousDate = 'Saturday, May 21'
}: WaterCardListProps) => {
  const [plants, setPlants] = useState(initialPlants);
  const [pendingUpdates, setPendingUpdates] = useState<Set<string>>(new Set());

  const handleWaterStatusChange = async (
    plantId: string,
    isWatered: boolean
  ) => {
    // 이미 업데이트 중인 식물이면 무시
    if (pendingUpdates.has(plantId)) return;

    try {
      // 1. 즉시 UI 업데이트 (Optimistic Update)
      setPendingUpdates(prev => new Set(prev).add(plantId));
      setPlants(prevPlants =>
        prevPlants.map(plant =>
          plant.id === plantId ? { ...plant, status: isWatered } : plant
        )
      );

      // 2. 서버에 업데이트 요청
      await updatePlantWateringStatus(plantId, isWatered);

      // 3. 성공적으로 완료됨
      setPendingUpdates(prev => {
        const next = new Set(prev);
        next.delete(plantId);
        return next;
      });
    } catch (error) {
      // 4. 실패 시 원래 상태로 롤백
      console.error('물주기 상태 업데이트 실패:', error);
      setPlants(prevPlants =>
        prevPlants.map(plant =>
          plant.id === plantId
            ? { ...plant, status: !isWatered } // 원래 상태로 되돌림
            : plant
        )
      );
      setPendingUpdates(prev => {
        const next = new Set(prev);
        next.delete(plantId);
        return next;
      });

      // 사용자에게 에러 알림
      // showToast('물주기 상태 업데이트에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 실제 API 호출 함수 (예시)
  const updatePlantWateringStatus = async (
    plantId: string,
    status: boolean
  ) => {
    // API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 실제로는 이런 식으로 API를 호출할 것입니다
    // const response = await fetch(`/api/plants/${plantId}/water`, {
    //   method: 'POST',
    //   body: JSON.stringify({ status }),
    // });
    // if (!response.ok) throw new Error('Failed to update watering status');
  };

  return (
    <div className="flex w-full flex-col gap-4 py-4">
      {/* 오늘의 물주기 카드 */}
      <div className="space-y-4">
        {plants.map(plant => (
          <WaterCard
            key={plant.id}
            backgroundColor="bg-[#dbad3a]"
            imageSrc={plant.image}
            statusIcon=""
            title={plant.name}
            amount={150}
            initialWaterStatus={plant.status}
            isUpdating={pendingUpdates.has(plant.id)}
            onWaterStatusChange={isWatered =>
              handleWaterStatusChange(plant.id, isWatered)
            }
          />
        ))}
      </div>

      {/* 지난 날 물주기 카드 */}
      {previousPlants.length > 0 && (
        <div className="mt-6 w-full space-y-4">
          <p className="text-2xl font-medium text-black">{previousDate}</p>
          {previousPlants.map(plant => (
            <WaterCard
              initialWaterStatus
              key={plant.id}
              backgroundColor="bg-[#dfdfdf]"
              imageSrc={plant.image}
              title={plant.name}
              amount={150}
              statusIcon=""
              isDisabled={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};
