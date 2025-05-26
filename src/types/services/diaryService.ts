/**
 * Diary 관련 서비스 레이어 타입 정의
 */

import { Diary, DiaryPreview, DiaryCreateInput, DiaryUpdateInput } from '../models/diary';

/**
 * 일기 필터링 옵션
 */
export interface DiaryFilterOptions {
  authorId?: string;
  plantId?: string;
  status?: string;
  searchQuery?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

/**
 * 일기 정렬 옵션
 */
export type DiarySortOption = 'date' | 'title' | 'status' | 'createdAt';

/**
 * 정렬 방향
 */
export type SortDirection = 'asc' | 'desc';

/**
 * 페이지네이션 결과
 */
export interface PaginatedDiaries {
  diaries: DiaryPreview[];
  total: number;
  hasMore: boolean;
  nextOffset?: number;
}

/**
 * 일기 서비스 인터페이스
 */
export interface DiaryService {
  getAllDiaries(options?: DiaryFilterOptions): Promise<PaginatedDiaries>;
  getDiaryById(id: string): Promise<Diary | null>;
  createDiary(data: DiaryCreateInput): Promise<Diary>;
  updateDiary(id: string, data: DiaryUpdateInput): Promise<Diary>;
  deleteDiary(id: string): Promise<boolean>;
} 