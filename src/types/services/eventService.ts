/**
 * Event 관련 서비스 레이어 타입 정의
 */

import { EventDetail, EventPreview, EventCreateInput, EventUpdateInput } from '../models/event';

/**
 * 이벤트 필터링 옵션
 */
export interface EventFilterOptions {
  isEnded?: boolean;
  searchQuery?: string;
  dateFrom?: string;
  dateTo?: string;
  authorId?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}

/**
 * 이벤트 정렬 옵션
 */
export type EventSortOption = 'startDate' | 'endDate' | 'title' | 'createdAt' | 'participants';

/**
 * 정렬 방향
 */
export type SortDirection = 'asc' | 'desc';

/**
 * 페이지네이션 결과
 */
export interface PaginatedEvents {
  events: EventPreview[];
  total: number;
  hasMore: boolean;
  nextOffset?: number;
}

/**
 * 이벤트 서비스 인터페이스
 */
export interface EventService {
  getActiveEvents(options?: EventFilterOptions): Promise<PaginatedEvents>;
  getEndedEvents(options?: EventFilterOptions): Promise<PaginatedEvents>;
  getEventById(id: string | number): Promise<EventDetail | null>;
  createEvent(data: EventCreateInput): Promise<EventDetail>;
  updateEvent(id: string | number, data: EventUpdateInput): Promise<EventDetail>;
  deleteEvent(id: string | number): Promise<boolean>;
  registerParticipant(eventId: string | number, userId: string): Promise<boolean>;
  getParticipants(eventId: string | number): Promise<Array<{id: string, name: string}>>;
} 