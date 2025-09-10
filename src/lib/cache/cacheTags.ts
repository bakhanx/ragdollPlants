/**
 * 캐시 태그 체계 정의
 * 일관된 태그 명명 규칙을 통해 캐시 관리 표준화
 */
export const CacheTags = {
  // 사용자 관련 태그
  garden: (loginId: string): CacheTagType => `garden-${loginId}`,
  userContent: (loginId: string): CacheTagType => `user-content-${loginId}`,

  // 콘텐츠별 태그 (사용자별 - 목록 페이지)
  plants: (loginId: string): CacheTagType => `plants-${loginId}`,
  diaries: (loginId: string): CacheTagType => `diaries-${loginId}`,
  galleries: (loginId: string): CacheTagType => `galleries-${loginId}`,
  care: (loginId: string): CacheTagType => `care-${loginId}`,
  notifications: (loginId: string): CacheTagType => `notifications-${loginId}`,
  // 콘텐츠별 태그 (개별 아이템 - 상세 페이지)
  plant: (plantId: string): CacheTagType => `plant-${plantId}`,
  diary: (diaryId: string): CacheTagType => `diary-${diaryId}`,
  gallery: (galleryId: string): CacheTagType => `gallery-${galleryId}`,
  article: (articleId: string): CacheTagType => `article-${articleId}`,
  event: (eventId: string): CacheTagType => `event-${eventId}`,

  // 콘텐츠별 태그 (전역) - 공개 콘텐츠 목록 페이지들
  allArticles: 'articles-all' as CacheTagType,
  allEvents: 'events-all' as CacheTagType,

  // 홈페이지 관련 태그
  homeBanner: 'home-banner' as CacheTagType,
  homeArticles: 'home-articles' as CacheTagType
} as const;

// 타입 안전성을 위한 태그 타입 정의 - 템플릿 리터럴 타입 사용
export type CacheTagType =
  | `garden-${string}`
  | `user-content-${string}`
  | `plants-${string}`
  | `diaries-${string}`
  | `galleries-${string}`
  | `care-${string}`
  | `notifications-${string}`
  | `plant-${string}`
  | `diary-${string}`
  | `gallery-${string}`
  | `article-${string}`
  | `event-${string}`
  | 'articles-all'
  | 'events-all'
  | 'content-all'
  | 'home-banner'
  | 'home-articles';
