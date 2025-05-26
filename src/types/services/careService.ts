/**
 * Care 관련 서비스 레이어 타입 정의
 */

import { PlantCare, PlantCarePreview, PlantCareCreateInput, PlantCareUpdateInput, CareRecord, CareReminder } from '../models/care';

/**
 * 케어 필터링 옵션
 */
export interface CareFilterOptions {
  authorId?: string;
  needsWater?: boolean;
  needsNutrient?: boolean;
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
  limit?: number;
  offset?: number;
}

/**
 * 케어 정렬 옵션
 */
export type CareSortOption = 'nextWateringDate' | 'nextNutrientDate' | 'name' | 'lastCared';

/**
 * 정렬 방향
 */
export type SortDirection = 'asc' | 'desc';

/**
 * 페이지네이션 결과
 */
export interface PaginatedCare {
  plants: PlantCarePreview[];
  total: number;
  hasMore: boolean;
  nextOffset?: number;
}

/**
 * 케어 통계
 */
export interface CareStats {
  totalWaterings: number;
  totalNutrients: number;
  plantsNeedingWater: number;
  plantsNeedingNutrient: number;
  todaysCare: number;
}

/**
 * 케어 서비스 인터페이스
 */
export interface CareService {
  getAllCare(options?: CareFilterOptions): Promise<PaginatedCare>;
  getCareById(id: string | number): Promise<PlantCare | null>;
  createCare(data: PlantCareCreateInput): Promise<PlantCare>;
  updateCare(id: string | number, data: PlantCareUpdateInput): Promise<PlantCare>;
  deleteCare(id: string | number): Promise<boolean>;
  waterPlant(plantId: string | number): Promise<PlantCare>;
  fertilizePlant(plantId: string | number): Promise<PlantCare>;
  getCareStats(authorId: string): Promise<CareStats>;
  getCareHistory(plantId: string | number): Promise<CareRecord[]>;
  createCareRecord(record: Omit<CareRecord, 'id' | 'createdAt'>): Promise<CareRecord>;
  getCareReminders(authorId: string): Promise<CareReminder[]>;
  createCareReminder(reminder: Omit<CareReminder, 'id' | 'createdAt'>): Promise<CareReminder>;
  completeCareReminder(reminderId: string): Promise<CareReminder>;
} 