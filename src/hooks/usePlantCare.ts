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

// 기본 식물 정보 (잘 안 바뀌는 데이터)
interface PlantBasicInfo {
  id: string;
  name: string;
  image: string;
}

// 케어 관련 데이터 (자주 바뀌는 데이터)
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
  onError?: (error: Error, plantId: string, careType: 'water' | 'nutrient') => void;
}

export function usePlantCare(initialPlant: PlantCareData, options?: UsePlantCareOptions) {
  const router = useRouter();
  const { user } = useAuthStore();
  
  // 상태를 분리하여 관리 - 기본 정보와 케어 데이터 분리
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

  // 간단한 날짜 계산 로직 - useMemo 불필요 (빠른 인라인 계산)
  const lastWateredStr = formatDateForInput(careInfo.lastWateredDate);
  const lastNutrientStr = formatDateForInput(careInfo.lastNutrientDate);
  
  const wateringInterval = careInfo.wateringInterval || 7;
  const nutrientInterval = careInfo.nutrientInterval || 30;

  // 다음 케어 날짜 계산 (순수 함수 - 빠름)
  const calculateNextDate = (lastDate: string, interval: number): string => {
    if (!lastDate) return '';
    const last = new Date(lastDate);
    const next = new Date(last);
    next.setDate(last.getDate() + interval);
    return next.toISOString().split('T')[0];
  };

  const waterNextDate = calculateNextDate(lastWateredStr, wateringInterval);
  const nutrientNextDate = calculateNextDate(lastNutrientStr, nutrientInterval);

  // 프로그레스 계산 (간단한 연산)
  const waterProgress = lastWateredStr
    ? calculateProgressPercentage(lastWateredStr, waterNextDate)
    : 0;
  const nutrientProgress = lastNutrientStr
    ? calculateProgressPercentage(lastNutrientStr, nutrientNextDate)
    : 0;

  // 남은 일수 계산 (간단한 연산)
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

  // 케어 가능 상태 (간단한 비교)
  const canWater = daysUntilWater !== wateringInterval;
  const canNutrient = daysUntilNutrient !== nutrientInterval;

  // D-day 표시 형식 (순수 함수)
  const formatDday = (days: number): string => {
    if (days < 0) return '기한 초과';
    if (days === 0) return '오늘';
    return `D-${days}`;
  };

  // 일찍 케어할지 확인 (순수 함수)
  const confirmEarlyCare = (type: 'water' | 'nutrient', days: number): boolean => {
    if (days <= 0) return true;
    return window.confirm(
      `${type === 'water' ? '물' : '영양제'} 주기까지 ${days}일 남았습니다. 지금 ${type === 'water' ? '물' : '영양제'}을 주시겠습니까?`
    );
  };

  // 낙관적 업데이트를 위한 케어 데이터 업데이트 함수
  const updateCareInfo = useCallback((careType: 'water' | 'nutrient') => {
    const now = new Date().toISOString().split('T')[0];
    
    setCareInfo(prev => {
      if (careType === 'water') {
        return {
          ...prev,
          lastWateredDate: now
        };
      } else {
        return {
          ...prev,
          lastNutrientDate: now
        };
      }
    });
  }, []); // 의존성 없음 - setCareInfo는 안정적

  // 공통 케어 로직 - 최적화된 의존성
  const handleCare = useCallback(async (careType: 'water' | 'nutrient') => {
    // 중복 요청 방지
    if (loadingStates[careType]) return;

    // 로그인 상태 확인
    if (!user) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    const days = careType === 'water' 
      ? daysUntilWater 
      : daysUntilNutrient;
      
    const canCare = careType === 'water' 
      ? canWater 
      : canNutrient;

    if (!canCare) return;

    // 일찍 케어하는 경우 확인
    if (days > 0 && !confirmEarlyCare(careType, days)) {
      return;
    }

    // 원본 케어 데이터 백업 (롤백용)
    const originalCareInfo = { ...careInfo };

    try {
      // 1. 로딩 상태 시작
      setLoadingStates(prev => ({ ...prev, [careType]: true }));

      // 2. 낙관적 업데이트 - 즉시 UI 반영
      updateCareInfo(careType);

      // 3. 서버 액션 실행
      await addCareRecord(basicInfo.id, careType);

      // 4. 성공 콜백 실행
      options?.onSuccess?.(basicInfo.id, careType);

    } catch (error) {
      console.error(`${careType} 기록 실패:`, error);
      
      // 5. 롤백 - 원본 상태로 복구
      setCareInfo(originalCareInfo);
      
      // 6. 에러 콜백 실행
      const errorMessage = error instanceof Error ? error : new Error('알 수 없는 오류');
      options?.onError?.(errorMessage, basicInfo.id, careType);
      
      // 7. 사용자에게 에러 알림
      alert(`${careType === 'water' ? '물주기' : '영양제'} 기록에 실패했습니다. 다시 시도해주세요.`);
      
    } finally {
      // 8. 로딩 상태 종료
      setLoadingStates(prev => ({ ...prev, [careType]: false }));
    }
  }, [
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
  ]); // 필요한 값들만 의존성에 포함

  // 물주기 함수 - 최적화된 의존성
  const handleWaterCare = useCallback(() => {
    return handleCare('water');
  }, [handleCare]);

  // 영양제 주기 함수 - 최적화된 의존성
  const handleNutrientCare = useCallback(() => {
    return handleCare('nutrient');
  }, [handleCare]);

  // 외부 데이터 동기화 - 최적화: 기본 정보와 케어 정보를 분리하여 업데이트
  const syncPlantData = useCallback((newPlantData: PlantCareData) => {
    // 케어 정보만 업데이트 (기본 정보는 변경되지 않음)
    setCareInfo({
      lastWateredDate: newPlantData.lastWateredDate,
      wateringInterval: newPlantData.wateringInterval,
      lastNutrientDate: newPlantData.lastNutrientDate,
      nutrientInterval: newPlantData.nutrientInterval
    });
  }, []);

  // 전체 식물 데이터 메모이제이션 - 기본 정보와 케어 정보 결합
  const plant = useMemo<PlantCareData>(() => ({
    ...basicInfo,
    ...careInfo
  }), [basicInfo, careInfo]);

  return {
    // 식물 데이터
    plant,
    
    // 직접 계산된 값들 (고속 인라인 계산)
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
    
    // 헬퍼 함수들 (순수 함수)
    formatDday,
    formatDate,
    
    // 액션들
    handleWaterCare,
    handleNutrientCare,
    
    // 상태들
    isWaterUpdating: loadingStates.water,
    isNutrientUpdating: loadingStates.nutrient,
    isUpdating: loadingStates.water || loadingStates.nutrient,
    
    // 유틸리티
    syncPlantData
  };
}

export type { PlantCareData, PlantBasicInfo, PlantCareInfo };
