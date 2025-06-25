import { PlantCategory } from '@/types/models/plant';

/**
 * 식물 카테고리 옵션
 */
export const PLANT_CATEGORIES: PlantCategory[] = [
  '실내식물',
  '다육식물', 
  '선인장',
  '관엽식물',
  '허브',
  '기타'
];

/**
 * 식물 카테고리를 select 옵션 형태로 변환
 */
export const PLANT_TYPE_OPTIONS = PLANT_CATEGORIES.map(category => ({
  value: category,
  label: category
}));

/**
 * 기본 물주기 간격 (일)
 */
export const DEFAULT_WATERING_INTERVAL = 7;

/**
 * 기본 영양제 간격 (일)
 */
export const DEFAULT_NUTRIENT_INTERVAL = 30; 