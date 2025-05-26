/**
 * Plant 관련 컴포넌트 Props 타입 정의
 */

import { Plant, PlantPreview, LegacyMyPlant } from '../models/plant';

/**
 * 식물 목록 컴포넌트 Props
 */
export interface MyPlantListProps {
  initialPlants: LegacyMyPlant[];
}

/**
 * 식물 항목 컴포넌트 Props
 */
export interface PlantItemProps {
  plant: LegacyMyPlant;
}

/**
 * 식물 상세 컴포넌트 Props
 */
export interface PlantDetailProps {
  plant: Plant;
}

/**
 * 식물 관리 알림 컴포넌트 Props
 */
export interface PlantCareAlertProps {
  needsWater: boolean;
  needsNutrient: boolean;
  lastWatered: string;
}

/**
 * 식물 폼 컴포넌트 Props (생성 및 수정에 모두 사용)
 */
export interface PlantFormProps {
  initialData?: Partial<Plant>;
  onSubmit: (data: Plant) => Promise<void>;
  isLoading?: boolean;
} 