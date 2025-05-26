/**
 * Event 관련 컴포넌트 Props 타입 정의
 */

import { EventTabType, EventDetail, EventPreview, LegacyBannerItem } from '../models/event';

/**
 * 이벤트 목록 컴포넌트 Props
 */
export interface EventListProps {
  initialActiveEvents: LegacyBannerItem[];
  initialEndedEvents: LegacyBannerItem[];
}

/**
 * 이벤트 카드 컴포넌트 Props
 */
export interface EventCardProps {
  event: LegacyBannerItem;
}

/**
 * 이벤트 상세 컴포넌트 Props
 */
export interface EventDetailProps {
  event: EventDetail;
}

/**
 * 이벤트 배너 슬라이더 컴포넌트 Props
 */
export interface EventBannerSliderProps {
  events: EventPreview[];
  autoplay?: boolean;
  interval?: number;
}

/**
 * 이벤트 폼 컴포넌트 Props (생성 및 수정에 모두 사용)
 */
export interface EventFormProps {
  initialData?: Partial<EventDetail>;
  onSubmit: (data: EventDetail) => Promise<void>;
  isLoading?: boolean;
} 