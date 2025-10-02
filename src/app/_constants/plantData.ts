/**
 * 식물 카테고리 옵션
 */
export const PLANT_CATEGORIES = [
  '공기정화',
  '관엽',
  '야자',
  '수경',
  '다육',
  '선인장',
  '허브',
  '꽃',
  '야생화',
  '리톱스',
  '구근',
  '채소',
  '과일',
  '기타'
] as const;

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
