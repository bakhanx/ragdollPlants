import { Diary } from '@prisma/client';

// 기본 Diary 타입 (Prisma 기반)
export type DiaryWithAuthor = Diary & {
  author: {
    id: string;
    name: string;
    image: string | null;
  };
  plant?: {
    id: string;
    name: string;
  } | null;
  likes?: number;
  isLiked?: boolean;
  isOwner?: boolean;
};

// 캐시된 Diary 타입 (Date → string 변환됨)
export type CachedDiary = Omit<DiaryWithAuthor, 
  'date' | 'createdAt' | 'updatedAt'
> & {
  date: string;
  createdAt: string;
  updatedAt: string;
};

// Diary 목록 응답 타입
export type DiariesResponse = {
  diaries: CachedDiary[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};