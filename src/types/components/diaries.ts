/**
 * Diary 관련 컴포넌트 Props 타입 정의
 */

import { DiaryMoodStatus, Diary } from '../models/diary';

/**
 * 일기 목록 컴포넌트 Props
 */
export interface DiaryListProps {
  initialPosts: Diary[];
}

/**
 * 일기 항목 컴포넌트 Props
 */
export interface DiaryItemProps {
  post: Diary;
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
  diary: Diary;
}

/**
 * 일기 폼 컴포넌트 Props (생성 및 수정에 모두 사용)
 */
export interface DiaryFormProps {
  initialData?: Partial<Diary>;
  onSubmit: (data: Diary) => Promise<void>;
  isLoading?: boolean;
  plants?: Array<{ id: string; name: string }>;
}
