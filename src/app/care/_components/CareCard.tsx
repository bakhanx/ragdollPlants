'use client';

import Image from 'next/image';
import Water2 from '@/../public/svg/water2.svg';
import ProgressBar from './ProgressBar';
import { formatDate } from '@/app/_utils/dateUtils';
import { useState, useEffect } from 'react';
import { NutrientIcon } from '@/app/_components/icons';

interface CareProgress {
  lastDate: string;
  nextDate: string;
  interval: number; // 일 단위
  progressPercentage: number;
}

interface Plant {
  id: string;
  name: string;
  image: string;
  waterStatus?: boolean;
  nutrientStatus?: boolean;
  waterInterval: number;
  nutrientInterval: number;
}

interface CareCardProps {
  plant: Plant;
  waterProgress: CareProgress;
  nutrientProgress: CareProgress;
  onWaterClick?: (plantId: string, newStatus: boolean) => void;
  onNutrientClick?: (plantId: string, newStatus: boolean) => void;
  isWaterUpdating?: boolean;
  isNutrientUpdating?: boolean;
  hideImage?: boolean;
}

export const CareCard = ({
  plant,
  waterProgress,
  nutrientProgress,
  onWaterClick,
  onNutrientClick,
  isWaterUpdating = false,
  isNutrientUpdating = false,
  hideImage = false
}: CareCardProps) => {
  // 남은 일수 계산 (정확한 D-day 값)
  const calcRemainingDays = (nextDate: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 시간 제거
    const next = new Date(nextDate);
    next.setHours(0, 0, 0, 0);
    const diffTime = next.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilWater = calcRemainingDays(waterProgress.nextDate);
  const daysUntilNutrient = calcRemainingDays(nutrientProgress.nextDate);

  // 물/영양제 를 줄 수 있는 상태인지 확인 (남은 일수가 주기와 같으면 방금 준 것)
  const canWater = daysUntilWater !== plant.waterInterval;
  const canNutrient = daysUntilNutrient !== plant.nutrientInterval;

  // 상태 관리 - 남은 일수가 주기와 같지 않으면 활성화(true)
  const [waterStatus, setWaterStatus] = useState(canWater);
  const [nutrientStatus, setNutrientStatus] = useState(canNutrient);

  // 남은 일수가 변경되면 상태 업데이트
  useEffect(() => {
    setWaterStatus(canWater);
  }, [daysUntilWater, canWater]);

  useEffect(() => {
    setNutrientStatus(canNutrient);
  }, [daysUntilNutrient, canNutrient]);

  // D-day 표시 형식
  const formatDday = (days: number): string => {
    if (days < 0) return '기한 초과';
    if (days === 0) return '오늘';
    return `D-${days}`;
  };

  // 주기를 일찍 진행할지 확인
  const confirmEarlyCare = (
    type: 'water' | 'nutrient',
    days: number
  ): boolean => {
    // D-day가 0 이하면 예정된 날짜이므로 확인 없이 진행
    if (days <= 0) return true;

    // 일찍 주는 경우에는 확인 대화상자 표시
    return window.confirm(
      `${type === 'water' ? '물' : '영양제'} 주기까지 ${days}일 남았습니다. 지금 ${type === 'water' ? '물' : '영양제'}을 주시겠습니까?`
    );
  };
  // 진행 상태 문구
  const getStatusText = (percentage: number): string => {
    if (percentage >= 80) return '상태 좋음';
    if (percentage >= 50) return '괜찮은 상태';
    if (percentage >= 20) return '조금 필요함';
    return '지금 필요함';
  };

  // 물주기 버튼 클릭 핸들러
  const handleWaterClick = () => {
    if (isWaterUpdating || !canWater) return;

    if (daysUntilWater > 0 && !confirmEarlyCare('water', daysUntilWater)) {
      return;
    }

    setWaterStatus(false);
    onWaterClick?.(plant.id, true);
  };

  // 영양제 주기 버튼 클릭 핸들러
  const handleNutrientClick = () => {
    if (isNutrientUpdating || !canNutrient) return;

    if (
      daysUntilNutrient > 0 &&
      !confirmEarlyCare('nutrient', daysUntilNutrient)
    ) {
      return;
    }

    setNutrientStatus(false);
    onNutrientClick?.(plant.id, true);
  };

  return (
    <div className="rounded-xl bg-white/90 p-4 shadow-sm backdrop-blur-sm">
      {!hideImage && <h3 className="pb-2 text-sm font-medium">{plant.name}</h3>}
      <div className="flex items-center gap-4">
        {!hideImage && (
          <div className="relative size-20 shrink-0 self-start">
            <Image
              src={plant.image}
              alt={plant.name}
              fill
              className="rounded-lg object-cover"
            />
          </div>
        )}

        <div className="flex-1 space-y-4">
          {/* 물주기 섹션 */}
          <div className="flex gap-x-2">
            <div className="w-full">
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {/* <Water className="size-4 text-blue-500" /> */}
                  <span className="text-sm font-medium">남은 물</span>
                </div>
                {/* 남은 기한 */}
                <div
                  className={`text-end text-xs font-medium ${
                    waterProgress.progressPercentage <= 20
                      ? 'text-red-500'
                      : waterProgress.progressPercentage <= 50
                        ? 'text-orange-500'
                        : 'text-blue-600'
                  }`}>
                  {formatDday(daysUntilWater)}
                </div>
              </div>
              <div className="space-y-1">
                <ProgressBar
                  percentage={waterProgress.progressPercentage}
                  color="bg-blue-500"
                />

                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs text-gray-500">
                    주기: {plant.waterInterval}일
                  </span>
                  <span className="text-xs text-gray-500">
                    ~ {formatDate(waterProgress.nextDate)}
                  </span>
                </div>
              </div>
            </div>
            {/* 물주기 버튼 */}
            <div className="flex items-center">
              <button
                onClick={handleWaterClick}
                disabled={isWaterUpdating || !canWater}
                className={`flex size-10 items-center justify-center rounded-full transition-all duration-300 ${
                  isWaterUpdating || !canWater
                    ? 'cursor-not-allowed bg-blue-100'
                    : 'bg-blue-200 hover:bg-blue-300 active:scale-95'
                }`}
                aria-label="물주기 완료"
                title={!canWater ? '아직 물을 줄 필요가 없습니다' : '물주기'}>
                <Water2
                  className={`size-5 transition-all duration-300 ${
                    waterStatus
                      ? '[&_path]:fill-blue-500'
                      : '[&_path]:fill-transparent'
                  } ${isWaterUpdating ? 'animate-pulse' : ''}`}
                />
              </button>
            </div>
          </div>

          {/* 영양제 주기 섹션 */}
          <div className="flex gap-x-2">
            <div className="w-full">
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">남은 영양제</span>
                </div>
                {/* 남은 기한 */}
                <div
                  className={`text-end text-xs font-medium ${
                    nutrientProgress.progressPercentage <= 20
                      ? 'text-red-500'
                      : nutrientProgress.progressPercentage <= 50
                        ? 'text-orange-500'
                        : 'text-green-600'
                  }`}>
                  {formatDday(daysUntilNutrient)}
                </div>
              </div>
              <div className="space-y-1">
                <ProgressBar
                  percentage={nutrientProgress.progressPercentage}
                  color="bg-green-500"
                />

                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs text-gray-500">
                    주기: {plant.nutrientInterval}회
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(nutrientProgress.nextDate)}
                  </span>
                </div>
              </div>
            </div>
            {/* 영양제 주기 버튼 */}
            <div className="flex items-center">
              <button
                onClick={handleNutrientClick}
                disabled={isNutrientUpdating || !canNutrient}
                className={`flex size-10 items-center justify-center rounded-full transition-all duration-300 ${
                  isNutrientUpdating || !canNutrient
                    ? 'cursor-not-allowed bg-green-100'
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
                    nutrientStatus
                      ? '[&_path]:fill-green-500'
                      : '[&_path]:fill-transparent'
                  } ${isNutrientUpdating ? 'animate-pulse' : ''}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
