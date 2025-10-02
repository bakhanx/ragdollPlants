/**
 * Diary 관련 컴포넌트 Props 타입 정의
 */

import { DiaryMoodStatus } from '../models/diary';
import { CachedDiary, DiariesResponse } from '../cache/diary';

/**
 * 일기 목록 컴포넌트 Props
 */
export interface DiaryListProps {
  diariesData: DiariesResponse | null;
  currentPage: number;
  searchQuery: string;
}

/**
 * 일기 항목 컴포넌트 Props
 */
export interface DiaryItemProps {
  post: CachedDiary;
  index: number;
}

/**
 * 일기 상태 컴포넌트 Props
 */
export interface DiaryStatusProps {
  status: DiaryMoodStatus;
  className?: string;
}

/**
 * 일기 내용 컴포넌트 Props
 */
export interface DiaryContentProps {
  diary: CachedDiary;
}

/**
 * 일기 폼 컴포넌트 Props (생성 및 수정에 모두 사용)
 */
export interface DiaryFormProps {
  initialData?: Partial<CachedDiary>;
  onSubmit: (data: CachedDiary) => Promise<void>;
  isLoading?: boolean;
  plants?: Array<{ id: string; name: string }>;
}
