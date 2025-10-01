import { PLANT_CATEGORIES } from '@/app/_constants/plantData';

// 식물 타입 카테고리
export type PlantCategory = (typeof PLANT_CATEGORIES)[number];

// 기본 Plant 인터페이스
export interface Plant {
  id: string | number;
  name: string;
  image: string;
  needsWater: boolean;
  needsNutrient: boolean;
  lastWatered: string;
  category: PlantCategory;
  description?: string;
  location?: string;
  purchaseDate?: string;
  wateringInterval?: number;
  nutrientInterval?: number;
  authorId?: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 목록에서 사용할 간소화된 Plant 타입
 */
export interface PlantPreview {
  id: string | number;
  name: string;
  image: string;
  needsWater: boolean;
  needsNutrient: boolean;
  lastWatered: string;
  category: PlantCategory;
}

/**
 * 레거시 MyPlant 타입과의 호환을 위한 타입
 */
export interface LegacyMyPlant {
  id: number;
  name: string;
  imageUrl: string;
  needsWater: boolean;
  needsNutrient: boolean;
  lastWatered: string;
  plantType: string;
}

/**
 * Prisma에서 사용할 Plant 생성 타입
 */
export interface PlantCreateInput {
  name: string;
  image: string;
  category: PlantCategory;
  description?: string;
  location?: string;
  purchaseDate?: string;
  wateringInterval?: number;
  nutrientInterval?: number;
  authorId?: string;
  tags?: string[];
}

/**
 * Prisma에서 사용할 Plant 수정 타입
 */
export interface PlantUpdateInput {
  name?: string;
  image?: string;
  category?: PlantCategory;
  description?: string;
  location?: string;
  purchaseDate?: string;
  wateringInterval?: number;
  nutrientInterval?: number;
  needsWater?: boolean;
  needsNutrient?: boolean;
  lastWatered?: string;
  tags?: string[];
}

/**
 * 식물 최대 등록 개수 제한
 */
export const MAX_PLANTS = 20;
