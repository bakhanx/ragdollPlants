/**
 * PlantCare 모델 타입 정의
 * Prisma와 Supabase를 고려한 구조
 */

// 권장 패턴:
// 1. 객체 모델: interface 사용
// 2. 유니온/리터럴 타입: type 사용
// 3. 임시/변환 타입: type 사용 (접두사 Legacy 또는 접미사 Compat 추가)

/**
 * 햇빛 노출 정도
 */
export type SunlightLevel = 'direct' | 'bright' | 'indirect' | 'filtered' | 'low';

/**
 * 기본 PlantCare 인터페이스
 */
export interface PlantCare {
  id: string | number;
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
  temperature?: number;
  humidity?: number;
  sunlight?: SunlightLevel;
  plantId?: string;
  authorId?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 목록에서 사용할 간소화된 PlantCare 타입
 */
export interface PlantCarePreview {
  id: string | number;
  name: string;
  image: string;
  waterStatus: boolean;
  nutrientStatus: boolean;
  nextWateringDate: string;
  nextNutrientDate: string;
}

/**
 * 레거시 MyPlant 타입과의 호환을 위한 타입
 */
export interface LegacyMyPlantCare {
  id: string;
  name: string;
  image: string;
  isNew: boolean;
  status: boolean;
  waterStatus?: boolean;
  nutrientStatus?: boolean;
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
}

/**
 * 케어 기록
 */
export interface CareRecord {
  id: string;
  plantId: string;
  type: 'water' | 'nutrient';
  date: string;
  amount?: number;
  notes?: string;
  authorId?: string;
  createdAt?: string;
}

/**
 * 케어 알림
 */
export interface CareReminder {
  id: string;
  plantId: string;
  type: 'water' | 'nutrient';
  scheduledDate: string;
  isCompleted: boolean;
  completedDate?: string;
  authorId?: string;
  createdAt?: string;
}

/**
 * Prisma에서 사용할 PlantCare 생성 타입
 */
export interface PlantCareCreateInput {
  name: string;
  image: string;
  waterInterval: number;
  nutrientInterval: number;
  plantId?: string;
  authorId?: string;
  temperature?: number;
  humidity?: number;
  sunlight?: SunlightLevel;
}

/**
 * Prisma에서 사용할 PlantCare 수정 타입
 */
export interface PlantCareUpdateInput {
  name?: string;
  image?: string;
  waterStatus?: boolean;
  nutrientStatus?: boolean;
  waterAmount?: number;
  lastWateredDate?: string;
  nextWateringDate?: string;
  waterInterval?: number;
  lastNutrientDate?: string;
  nextNutrientDate?: string;
  nutrientInterval?: number;
  temperature?: number;
  humidity?: number;
  sunlight?: SunlightLevel;
} 