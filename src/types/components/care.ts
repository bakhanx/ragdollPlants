/**
 * Care 관련 컴포넌트 Props 타입 정의
 */

import { PlantCare, PlantCarePreview, LegacyMyPlantCare } from '../models/care';

/**
 * 케어 카드 목록 컴포넌트 Props
 */
export interface CareCardListProps {
  plants: LegacyMyPlantCare[];
}

/**
 * 케어 카드 컴포넌트 Props
 */
export interface CareCardProps {
  plant: LegacyMyPlantCare;
  onWaterStatusChange: (plantId: string, status: boolean) => void;
  onNutrientStatusChange: (plantId: string, status: boolean) => void;
  isWaterPending?: boolean;
  isNutrientPending?: boolean;
}

/**
 * 진행률 바 컴포넌트 Props
 */
export interface ProgressBarProps {
  percentage: number;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 케어 상태 배지 컴포넌트 Props
 */
export interface CareStatusBadgeProps {
  status: boolean;
  type: 'water' | 'nutrient';
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * 케어 히스토리 컴포넌트 Props
 */
export interface CareHistoryProps {
  plantId: string;
  records: Array<{
    date: string;
    type: 'water' | 'nutrient';
    amount?: number;
    notes?: string;
  }>;
}

/**
 * 케어 알림 설정 컴포넌트 Props
 */
export interface CareReminderSettingsProps {
  plantId: string;
  waterInterval: number;
  nutrientInterval: number;
  onUpdate: (plantId: string, waterInterval: number, nutrientInterval: number) => Promise<void>;
} 