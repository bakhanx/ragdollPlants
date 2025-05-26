/**
 * Plant 관련 서비스 레이어 타입 정의
 */

import { Plant, PlantPreview, PlantCreateInput, PlantUpdateInput, PlantCategory } from '../models/plant';

/**
 * 식물 필터링 옵션
 */
export interface PlantFilterOptions {
  authorId?: string;
  category?: PlantCategory;
  searchQuery?: string;
  needsWater?: boolean;
  needsNutrient?: boolean;
  tags?: string[];
  limit?: number;
  offset?: number;
}

/**
 * 식물 정렬 옵션
 */
export type PlantSortOption = 'name' | 'lastWatered' | 'purchaseDate' | 'createdAt';

/**
 * 정렬 방향
 */
export type SortDirection = 'asc' | 'desc';

/**
 * 페이지네이션 결과
 */
export interface PaginatedPlants {
  plants: PlantPreview[];
  total: number;
  hasMore: boolean;
  nextOffset?: number;
}

/**
 * 식물 서비스 인터페이스
 */
export interface PlantService {
  getAllPlants(options?: PlantFilterOptions): Promise<PaginatedPlants>;
  getPlantById(id: string | number): Promise<Plant | null>;
  createPlant(data: PlantCreateInput): Promise<Plant>;
  updatePlant(id: string | number, data: PlantUpdateInput): Promise<Plant>;
  deletePlant(id: string | number): Promise<boolean>;
  waterPlant(id: string | number): Promise<Plant>;
  fertilizePlant(id: string | number): Promise<Plant>;
  checkPlantCareStatus(): Promise<{
    needsWater: Plant[];
    needsNutrient: Plant[];
  }>;
} 