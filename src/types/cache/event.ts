import { Event } from '@prisma/client';

// 기본 Event 타입 (Prisma 기반)
export type EventWithAuthor = Event & {
  author: {
    id: string;
    name: string;
    image: string | null;
  };
  likes?: number;
  isLiked?: boolean;
  isOwner?: boolean;
};

// 캐시된 Event 타입 (Date → string 변환됨)
export type CachedEvent = Omit<EventWithAuthor, 
  'startDate' | 'endDate' | 'createdAt' | 'updatedAt'
> & {
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

// Event 목록 응답 타입
export type EventsResponse = {
  events: CachedEvent[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

// 공개 Event 목록 응답 타입 (페이지네이션 없음)
export type PublicEventsResponse = CachedEvent[];