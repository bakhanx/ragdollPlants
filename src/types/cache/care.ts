// Care 관련 캐시 타입 정의

// 기본 Care 데이터 타입 (현재 getUserPlantsForCare 반환 타입 기반)
export type CareData = {
  id: string;
  name: string;
  image: string;
  isNew: boolean;
  status: boolean;
  waterStatus: boolean;
  nutrientStatus: boolean;
  waterAmount: number;
  lastWateredDate: string;
  nextWateringDate: string;
  waterInterval: number;
  lastNutrientDate: string;
  nextNutrientDate: string;
  nutrientInterval: number;
  temperature: number;
  humidity: number;
  sunlight: string;
};

// 캐시된 Care 타입 (이미 string 형태이므로 변환 불필요)
export type CachedCare = CareData;

// Care 목록 응답 타입
export type CareResponse = CachedCare[];