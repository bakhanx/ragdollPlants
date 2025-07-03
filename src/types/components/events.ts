import { EventDetail, EventPreview } from '../models/event';

export interface EventWithAuthor {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link: string;
  startDate: Date;
  endDate: Date;
  isEnded: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

/**
 * 이벤트 목록 컴포넌트 Props
 */
export interface EventListProps {
  initialActiveEvents: EventWithAuthor[];
  initialEndedEvents: EventWithAuthor[];
  isAdmin: boolean;
}

/**
 * 이벤트 카드 컴포넌트 Props
 */
export interface EventCardProps {
  event: EventWithAuthor;
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
