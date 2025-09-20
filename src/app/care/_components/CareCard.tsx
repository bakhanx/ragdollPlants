'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Water2Icon, NutrientIcon } from '@/app/_components/icons/Icons';
import ProgressBar from './ProgressBar';
import { usePlantCare, type PlantCareData } from '@/hooks/usePlantCare';
import { useEffect } from 'react';
import { PLANT_PLACEHOLDER } from '@/app/_constants/imagePlaceholders';

interface CareCardProps {
  plant: PlantCareData;
  hideImage?: boolean;
}

export const CareCard = ({ plant, hideImage = false }: CareCardProps) => {
  const {
    plant: currentPlant,
    waterProgress,
    nutrientProgress,
    daysUntilWater,
    daysUntilNutrient,
    canWater,
    canNutrient,
    waterNextDate,
    nutrientNextDate,
    wateringInterval,
    nutrientInterval,
    formatDday,
    formatDate,
    handleWaterCare,
    handleNutrientCare,
    isWaterUpdating,
    isNutrientUpdating,
    syncPlantData
  } = usePlantCare(plant);

  // 데이터 동기화
  useEffect(() => {
    syncPlantData(plant);
  }, [plant, syncPlantData]);

  return (
    <div className="rounded-xl bg-white/90 p-4 shadow-sm backdrop-blur-sm">
      {!hideImage && (
        <Link href={`/myplants/${currentPlant.id}`}>
          <h3 className="cursor-pointer pb-2 text-sm font-medium transition-colors hover:text-green-600">
            {currentPlant.name}
          </h3>
        </Link>
      )}
      <div className="flex items-center gap-4">
        {!hideImage && (
          <Link href={`/myplants/${currentPlant.id}`}>
            <div className="relative size-20 shrink-0 cursor-pointer self-start transition-opacity hover:opacity-80">
              <Image
                src={currentPlant.image}
                alt={currentPlant.name}
                fill
                placeholder="blur"
                blurDataURL={PLANT_PLACEHOLDER}
                className="rounded-lg object-cover"
                sizes="80px"
              />
            </div>
          </Link>
        )}

        <div className="flex-1 space-y-4">
          {/* 물주기 섹션 */}
          <div className="flex gap-x-2">
            <div className="w-full">
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">남은 물</span>
                </div>
                {/* 남은 기한 */}
                <div
                  className={`text-end text-xs font-medium ${
                    waterProgress <= 20
                      ? 'text-red-500'
                      : waterProgress <= 50
                        ? 'text-orange-500'
                        : 'text-blue-600'
                  }`}>
                  {formatDday(daysUntilWater)}
                </div>
              </div>
              <div className="space-y-1">
                <ProgressBar
                  percentage={waterProgress}
                  color="bg-blue-500"
                />

                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs text-gray-500">
                    주기: {wateringInterval}일
                  </span>
                  <span className="text-xs text-gray-500">
                    ~ {formatDate(waterNextDate)}
                  </span>
                </div>
              </div>
            </div>
            {/* 물주기 버튼 */}
            <div className="flex items-center">
              <button
                onClick={handleWaterCare}
                disabled={isWaterUpdating || !canWater}
                className={`flex size-10 items-center justify-center rounded-full transition-all duration-300 ${
                  isWaterUpdating || !canWater
                    ? 'bg-gray-300'
                    : 'bg-blue-200 hover:bg-blue-300 active:scale-95'
                }`}
                aria-label="물주기 완료"
                title={!canWater ? '아직 물을 줄 필요가 없습니다' : '물주기'}>
                <Water2Icon
                  className={`size-5 transition-all duration-300 ${
                    canWater
                      ? 'text-blue-600'
                      : 'cursor-not-allowed text-transparent'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 영양제 섹션 */}
          <div className="flex gap-x-2">
            <div className="w-full">
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">남은 영양제</span>
                </div>
                {/* 남은 기한 */}
                <div
                  className={`text-end text-xs font-medium ${
                    nutrientProgress <= 20
                      ? 'text-red-500'
                      : nutrientProgress <= 50
                        ? 'text-orange-500'
                        : 'text-green-600'
                  }`}>
                  {formatDday(daysUntilNutrient)}
                </div>
              </div>
              <div className="space-y-1">
                <ProgressBar
                  percentage={nutrientProgress}
                  color="bg-green-500"
                />
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs text-gray-500">
                    주기: {nutrientInterval}일
                  </span>
                  <span className="text-xs text-gray-500">
                    ~ {formatDate(nutrientNextDate)}
                  </span>
                </div>
              </div>
            </div>
            {/* 영양제 버튼 */}
            <div className="flex items-center">
              <button
                onClick={handleNutrientCare}
                disabled={isNutrientUpdating || !canNutrient}
                className={`flex size-10 items-center justify-center rounded-full transition-all duration-300 ${
                  isNutrientUpdating || !canNutrient
                    ? 'bg-gray-300'
                    : 'bg-green-200 hover:bg-green-300 active:scale-95'
                }`}
                aria-label="영양제 주기 완료"
                title={
                  !canNutrient
                    ? '아직 영양제를 줄 필요가 없습니다'
                    : '영양제 주기'
                }>
                <NutrientIcon
                  className={`size-6 transition-all duration-300 ${
                    canNutrient
                      ? 'text-white [&>path]:fill-green-500'
                      : 'cursor-not-allowed text-white'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
