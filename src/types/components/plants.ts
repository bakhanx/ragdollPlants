/**
 * Plant 관련 컴포넌트 Props 타입 정의
 */

import { CachedPlant } from '../cache/plant';
import { getMyPlants } from '@/app/actions/plants';

/**
 * 식물 목록 컴포넌트 Props
 */
export interface MyPlantListProps {
  plantsData: Awaited<ReturnType<typeof getMyPlants>> | null;
  searchQuery: string;
}

/**
 * 식물 항목 컴포넌트 Props
 */
export interface PlantItemProps {
  plant: CachedPlant;
}

/**
 * 식물 상세 컴포넌트 Props
 */
export interface PlantDetailProps {
  plant: CachedPlant;
  isOwner?: boolean;
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
  initialData?: Partial<CachedPlant>;
  onSubmit: (data: CachedPlant) => Promise<void>;
  isLoading?: boolean;
}
