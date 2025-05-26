/**
 * Event 모델 타입 정의
 * Prisma와 Supabase를 고려한 구조
 */

// 권장 패턴:
// 1. 객체 모델: interface 사용
// 2. 유니온/리터럴 타입: type 사용
// 3. 임시/변환 타입: type 사용 (접두사 Legacy 또는 접미사 Compat 추가)

/**
 * 이벤트 탭 타입 정의
 */
export type EventTabType = 'active' | 'ended';

/**
 * 기본 이벤트 배너 인터페이스
 */
export interface EventBanner {
  id: string | number;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  isEnded?: boolean;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 이벤트 상세 정보 인터페이스
 */
export interface EventDetail extends EventBanner {
  description: string;
  content: string;
  period: string;
  authorId?: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  thumbnailImage?: string;
  tags?: string[];
  viewCount?: number;
  participants?: number;
}

/**
 * 이벤트 목록에서 사용할 간소화된 이벤트 타입
 */
export interface EventPreview {
  id: string | number;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  isEnded?: boolean;
  period?: string;
}

/**
 * 레거시 BannerItem 타입과의 호환을 위한 타입
 */
export interface LegacyBannerItem {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
  isEnded?: boolean;
}

/**
 * 레거시 EventDetail 타입과의 호환을 위한 타입
 */
export interface LegacyEventDetail {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  period: string;
  description: string;
  content: string;
  isEnded?: boolean;
}

/**
 * Prisma에서 사용할 이벤트 생성 타입
 */
export interface EventCreateInput {
  title: string;
  subtitle: string;
  image: string;
  link: string;
  description: string;
  content: string;
  startDate: string;
  endDate: string;
  authorId?: string;
  thumbnailImage?: string;
  tags?: string[];
}

/**
 * Prisma에서 사용할 이벤트 수정 타입
 */
export interface EventUpdateInput {
  title?: string;
  subtitle?: string;
  image?: string;
  link?: string;
  description?: string;
  content?: string;
  startDate?: string;
  endDate?: string;
  isEnded?: boolean;
  thumbnailImage?: string;
  tags?: string[];
} 