'use client';

import Image from 'next/image';
import { Water2Icon, NutrientIcon } from '@/app/_components/icons/Icons';
import ProgressBar from './ProgressBar';
import {
  formatDate,
  calculateCareProgressPercentage,
  formatDateForInput
} from '@/app/_utils/dateUtils';
import { useState, useEffect } from 'react';
import { addCareRecord } from '@/app/actions/care';
import { useRouter } from 'next/navigation';

interface Plant {
  id: string;
  name: string;
  image: string;
  lastWateredDate: string | null;
  wateringInterval: number | null;
  lastNutrientDate: string | null;
  nutrientInterval: number | null;
}

interface CareCardProps {
  plant: Plant;
  hideImage?: boolean;
}

export const CareCard = ({ plant, hideImage = false }: CareCardProps) => {
  const router = useRouter();
  const [isWaterUpdating, setIsWaterUpdating] = useState(false);
  const [isNutrientUpdating, setIsNutrientUpdating] = useState(false);

  // 케어 데이터 계산
  const lastWateredStr = formatDateForInput(plant.lastWateredDate);
  const lastNutrientStr = formatDateForInput(plant.lastNutrientDate);

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
    ? calculateCareProgressPercentage(lastWateredStr, waterNextDate)
    : 0;

  const nutrientProgress = lastNutrientStr
    ? calculateCareProgressPercentage(lastNutrientStr, nutrientNextDate)
    : 0;

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

  const daysUntilWater = calcRemainingDays(waterNextDate);
  const daysUntilNutrient = calcRemainingDays(nutrientNextDate);

  // 물/영양제 를 줄 수 있는 상태인지 확인 (남은 일수가 주기와 같으면 방금 준 것)
  const canWater = daysUntilWater !== wateringInterval;
  const canNutrient = daysUntilNutrient !== nutrientInterval;

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

  // 물주기 버튼 클릭 핸들러
  const handleWaterButtonClick = async () => {
    if (isWaterUpdating || !canWater) return;

    if (daysUntilWater > 0 && !confirmEarlyCare('water', daysUntilWater)) {
      return;
    }

    try {
      setIsWaterUpdating(true);
      setWaterStatus(false);
      await addCareRecord(plant.id, 'water');
      router.refresh(); // 페이지 새로고침으로 데이터 동기화
    } catch (error) {
      console.error('물주기 기록 실패:', error);
      alert('물주기 기록에 실패했습니다. 다시 시도해주세요.');
      setWaterStatus(true); // 실패시 원래 상태로 복구
    } finally {
      setIsWaterUpdating(false);
    }
  };

  // 영양제 주기 버튼 클릭 핸들러
  const handleNutrientButtonClick = async () => {
    if (isNutrientUpdating || !canNutrient) return;

    if (
      daysUntilNutrient > 0 &&
      !confirmEarlyCare('nutrient', daysUntilNutrient)
    ) {
      return;
    }

    try {
      setIsNutrientUpdating(true);
      setNutrientStatus(false);
      await addCareRecord(plant.id, 'nutrient');
      router.refresh(); // 페이지 새로고침으로 데이터 동기화
    } catch (error) {
      console.error('영양제 기록 실패:', error);
      alert('영양제 기록에 실패했습니다. 다시 시도해주세요.');
      setNutrientStatus(true); // 실패시 원래 상태로 복구
    } finally {
      setIsNutrientUpdating(false);
    }
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
                onClick={handleWaterButtonClick}
                disabled={isWaterUpdating || !canWater}
                className={`flex size-10 items-center justify-center rounded-full transition-all duration-300 ${
                  isWaterUpdating || !canWater
                    ? 'cursor-not-allowed bg-blue-100'
                    : 'bg-blue-200 hover:bg-blue-300 active:scale-95'
                }`}
                aria-label="물주기 완료"
                title={!canWater ? '아직 물을 줄 필요가 없습니다' : '물주기'}>
                <Water2Icon
                  className={`size-5 transition-all duration-300 ${
                    waterStatus
                      ? 'text-blue-600 [&>path]:fill-blue-600'
                      : 'scale-110 text-blue-700 drop-shadow-sm [&>path]:fill-none'
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
                onClick={handleNutrientButtonClick}
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
                  className={`size-5 transition-all duration-300 ${
                    nutrientStatus
                      ? 'text-green-600 [&>path]:fill-green-600'
                      : 'scale-110 text-green-700 drop-shadow-sm'
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
