'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { addCareRecord } from '@/app/actions/care';
import { useAuthStore } from '@/stores/authStore';
import {
  calculateProgressPercentage,
  formatDate,
  formatDateForInput
} from '@/app/_utils/dateUtils';

// 기본 식물 정보
interface PlantBasicInfo {
  id: string;
  name: string;
  image: string;
}

// 케어 관련 데이터
interface PlantCareInfo {
  lastWateredDate: string | null;
  wateringInterval: number | null;
  lastNutrientDate: string | null;
  nutrientInterval: number | null;
}

// 전체 식물 데이터
interface PlantCareData extends PlantBasicInfo, PlantCareInfo {}

interface UsePlantCareOptions {
  onSuccess?: (plantId: string, careType: 'water' | 'nutrient') => void;
  onError?: (
    error: Error,
    plantId: string,
    careType: 'water' | 'nutrient'
  ) => void;
}

export function usePlantCare(
  initialPlant: PlantCareData,
  options?: UsePlantCareOptions
) {
  const router = useRouter();
  const { user } = useAuthStore();

  // 상태를 분리하여 관리
  const [basicInfo] = useState<PlantBasicInfo>({
    id: initialPlant.id,
    name: initialPlant.name,
    image: initialPlant.image
  });

  const [careInfo, setCareInfo] = useState<PlantCareInfo>({
    lastWateredDate: initialPlant.lastWateredDate,
    wateringInterval: initialPlant.wateringInterval,
    lastNutrientDate: initialPlant.lastNutrientDate,
    nutrientInterval: initialPlant.nutrientInterval
  });

  // 개별 액션별 로딩 상태
  const [loadingStates, setLoadingStates] = useState<{
    water: boolean;
    nutrient: boolean;
  }>({
    water: false,
    nutrient: false
  });

  // 간단한 날짜 계산 로직
  const lastWateredStr = formatDateForInput(careInfo.lastWateredDate);
  const lastNutrientStr = formatDateForInput(careInfo.lastNutrientDate);

  const wateringInterval = careInfo.wateringInterval || 7;
  const nutrientInterval = careInfo.nutrientInterval || 30;

  // 다음 케어 날짜 계산 (시간대 독립적)
  const calculateNextDate = (lastDate: string, interval: number): string => {
    if (!lastDate) return '';

    // 문자열에서 직접 날짜 파싱 (시간대 무관)
    const [year, month, day] = lastDate.split('-').map(Number);

    // Date 객체 생성 (로컬 시간대 기준)
    const date = new Date(year, month - 1, day); // month는 0부터 시작

    // 일수 더하기
    date.setDate(date.getDate() + interval);

    // YYYY-MM-DD 형식으로 반환 (시간대 무관)
    const nextYear = date.getFullYear();
    const nextMonth = String(date.getMonth() + 1).padStart(2, '0');
    const nextDay = String(date.getDate()).padStart(2, '0');

    return `${nextYear}-${nextMonth}-${nextDay}`;
  };

  const waterNextDate = calculateNextDate(lastWateredStr, wateringInterval);
  const nutrientNextDate = calculateNextDate(lastNutrientStr, nutrientInterval);

  // 프로그레스 계산
  const waterProgress = lastWateredStr
    ? calculateProgressPercentage(lastWateredStr, waterNextDate)
    : 0;
  const nutrientProgress = lastNutrientStr
    ? calculateProgressPercentage(lastNutrientStr, nutrientNextDate)
    : 0;

  // 남은 일수 계산
  const calcRemainingDays = (nextDate: string): number => {
    if (!nextDate) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const next = new Date(nextDate);
    next.setHours(0, 0, 0, 0);
    const diffTime = next.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilWater = calcRemainingDays(waterNextDate);
  const daysUntilNutrient = calcRemainingDays(nutrientNextDate);

  // 케어 가능 상태
  const canWater = daysUntilWater !== wateringInterval;
  const canNutrient = daysUntilNutrient !== nutrientInterval;

  // D-day 표시 형식
  const formatDday = (days: number): string => {
    if (days < 0) return '기한 초과';
    if (days === 0) return '오늘';
    return `D-${days}`;
  };

  // 일찍 케어할지 확인
  const confirmEarlyCare = (
    type: 'water' | 'nutrient',
    days: number
  ): boolean => {
    if (days <= 0) return true;
    return window.confirm(
      `${type === 'water' ? '물' : '영양제'} 주기까지 ${days}일 남았습니다. 지금 ${type === 'water' ? '물' : '영양제'}을 주시겠습니까?`
    );
  };

  //케어 데이터 업데이트 함수 (Optimistic) - 시간대 독립적
  const updateCareInfo = useCallback((careType: 'water' | 'nutrient') => {
    // 로컬 시간대로 오늘 날짜 계산
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    setCareInfo(prev => {
      if (careType === 'water') {
        return {
          ...prev,
          lastWateredDate: todayStr
        };
      } else {
        return {
          ...prev,
          lastNutrientDate: todayStr
        };
      }
    });
  }, []);

  // 공통 케어 로직
  const handleCare = useCallback(
    async (careType: 'water' | 'nutrient') => {
      // 중복 요청 방지
      if (loadingStates[careType]) return;

      // 로그인 상태 확인

      if (!user && window.confirm('로그인 페이지로 이동하시겠습니까?')) {
        router.push('/login');
        return;
      }

      const days = careType === 'water' ? daysUntilWater : daysUntilNutrient;

      const canCare = careType === 'water' ? canWater : canNutrient;

      if (!canCare) return;

      // 일찍 케어하는 경우 확인
      if (days > 0 && !confirmEarlyCare(careType, days)) {
        return;
      }

      // 원본 케어 데이터 백업 (롤백용)
      const originalCareInfo = { ...careInfo };

      try {
        // 로딩 상태
        setLoadingStates(prev => ({ ...prev, [careType]: true }));

        // Optimistic UI 업데이트
        updateCareInfo(careType);

        // 서버 액션 실행
        await addCareRecord(basicInfo.id, careType);

        // 성공 콜백 실행
        options?.onSuccess?.(basicInfo.id, careType);

        // 최신 데이터 로딩
        router.refresh();
      } catch (error) {
        console.error(`${careType} 기록 실패:`, error);

        // 롤백
        setCareInfo(originalCareInfo);

        const errorMessage =
          error instanceof Error ? error : new Error('알 수 없는 오류');
        options?.onError?.(errorMessage, basicInfo.id, careType);

        alert(
          `${careType === 'water' ? '물주기' : '영양제'} 기록에 실패했습니다. 다시 시도해주세요.`
        );
      } finally {
        // 8. 로딩 상태 종료
        setLoadingStates(prev => ({ ...prev, [careType]: false }));
      }
    },
    [
      loadingStates,
      user,
      router,
      daysUntilWater,
      daysUntilNutrient,
      canWater,
      canNutrient,
      updateCareInfo,
      basicInfo.id,
      careInfo,
      options
    ]
  );

  // 물주기
  const handleWaterCare = useCallback(() => {
    return handleCare('water');
  }, [handleCare]);

  // 영양제 주기
  const handleNutrientCare = useCallback(() => {
    return handleCare('nutrient');
  }, [handleCare]);

  // 외부 데이터 동기화
  const syncPlantData = useCallback((newPlantData: PlantCareData) => {
    // 케어 정보만 업데이트
    setCareInfo({
      lastWateredDate: newPlantData.lastWateredDate,
      wateringInterval: newPlantData.wateringInterval,
      lastNutrientDate: newPlantData.lastNutrientDate,
      nutrientInterval: newPlantData.nutrientInterval
    });
  }, []);

  // 전체 식물 데이터 메모이제이션
  const plant = useMemo<PlantCareData>(
    () => ({
      ...basicInfo,
      ...careInfo
    }),
    [basicInfo, careInfo]
  );

  return {
    // 식물 데이터
    plant,

    // 직접 계산된 값
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

    // 헬퍼 함수
    formatDday,
    formatDate,

    // 액션
    handleWaterCare,
    handleNutrientCare,

    // 상태
    isWaterUpdating: loadingStates.water,
    isNutrientUpdating: loadingStates.nutrient,
    isUpdating: loadingStates.water || loadingStates.nutrient,

    // 유틸리티
    syncPlantData
  };
}

export type { PlantCareData, PlantBasicInfo, PlantCareInfo };
