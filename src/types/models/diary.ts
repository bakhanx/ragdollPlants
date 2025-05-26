/**
 * Diary 모델 타입 정의
 * Prisma와 Supabase를 고려한 구조
 */

// 권장 패턴:
// 1. 객체 모델: interface 사용
// 2. 유니온/리터럴 타입: type 사용
// 3. 임시/변환 타입: type 사용 (접두사 Legacy 또는 접미사 Compat 추가)

/**
 * 일기 상태 타입 정의
 * 상태에 따라 다른 UI 표시
 */
export type DiaryMoodStatus = 'good' | 'normal' | 'bad';

/**
 * 기본 Diary 인터페이스
 */
export interface Diary {
  id: string;
  title: string;
  content: string;
  date: string;
  image: string;
  status: DiaryMoodStatus;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  plantId?: string;
  plantName?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 목록에서 사용할 간소화된 Diary 타입
 */
export interface DiaryPreview {
  id: string;
  title: string;
  content: string;
  date: string;
  image: string;
  status: DiaryMoodStatus;
  author?: {
    id: string;
    name: string;
  };
}

/**
 * 레거시 DiaryPost 타입과의 호환을 위한 타입
 * 기존 코드와의 호환성 유지를 위해 필요
 */
export interface LegacyDiaryPost {
  id: string;
  title: string;
  content: string;
  date: string;
  imageUrl: string;
  status: DiaryMoodStatus;
  authorName?: string;
}

/**
 * Prisma에서 사용할 Diary 생성 타입
 */
export interface DiaryCreateInput {
  title: string;
  content: string;
  image?: string;
  status: DiaryMoodStatus;
  authorId?: string;
  plantId?: string;
  plantName?: string;
  tags?: string[];
}

/**
 * Prisma에서 사용할 Diary 수정 타입
 */
export interface DiaryUpdateInput {
  title?: string;
  content?: string;
  image?: string;
  status?: DiaryMoodStatus;
  plantId?: string;
  plantName?: string;
  tags?: string[];
} 