import { revalidateTag } from 'next/cache';
import { CacheTags, type CacheTagType } from './cacheTags';

/**
 * 데이터 변경 시 무효화해야 할 캐시 태그들의 의존성 매핑
 */
export const InvalidationMap = {
  // 사용자 프로필 변경 시 (이름, 프로필 사진, 소개 등)
  gardenProfile: (userId: string): CacheTagType[] => [
    CacheTags.garden(userId), // 해당 사용자의 garden 페이지
    CacheTags.userContent(userId) // 해당 사용자가 작성한 모든 콘텐츠
  ],

  // 식물 추가/삭제 시
  plantCreate: (userId: string): CacheTagType[] => [
    CacheTags.garden(userId), // garden 페이지 (식물 개수)
    CacheTags.plants(userId), // 해당 사용자의 식물 목록 페이지
    CacheTags.care(userId) // care 페이지 (식물 목록 변경)
  ],

  // 특정 식물 수정 시 (어떤 필드든 변경 시)
  plantUpdate: (userId: string, plantId: string): CacheTagType[] => [
    CacheTags.plants(userId), // 식물 목록 페이지 (이름, 이미지 등 변경 가능)
    CacheTags.plant(plantId), // 해당 식물 상세 페이지
    CacheTags.garden(userId), // garden 페이지 (관리 필요한 식물 개수 변경 가능)
    CacheTags.care(userId) // care 페이지 (식물 이름 등 표시)
  ],

  // 다이어리 작성/삭제 시
  diaryCreate: (userId: string): CacheTagType[] => [
    CacheTags.garden(userId), // garden 페이지 (다이어리 개수)
    CacheTags.diaries(userId) // 해당 사용자의 다이어리 목록 페이지
  ],

  // 특정 다이어리 수정 시 (어떤 필드든 변경 시)
  diaryUpdate: (userId: string, diaryId: string): CacheTagType[] => [
    CacheTags.diaries(userId), // 다이어리 목록 페이지 (제목, 썸네일 등 변경 가능)
    CacheTags.diary(diaryId), // 해당 다이어리 상세 페이지
    CacheTags.garden(userId) // garden 페이지 (다이어리 정보 변경 시)
  ],

  // 갤러리 업로드/삭제 시
  galleryCreate: (userId: string): CacheTagType[] => [
    CacheTags.garden(userId), // garden 페이지 (갤러리 개수)
    CacheTags.galleries(userId) // 해당 사용자의 갤러리 목록 페이지
  ],

  // 특정 갤러리 수정 시 (어떤 필드든 변경 시)
  galleryUpdate: (userId: string, galleryId: string): CacheTagType[] => [
    CacheTags.galleries(userId), // 갤러리 목록 페이지 (제목, 썸네일 등 변경 가능)
    CacheTags.gallery(galleryId), // 해당 갤러리 상세 페이지
    CacheTags.garden(userId) // garden 페이지 (갤러리 정보 변경 시)
  ],

  // 아티클 작성/삭제 시 (관리자만)
  articleCreate: (): CacheTagType[] => [
    CacheTags.allArticles, // 전체 아티클 목록
    CacheTags.homeArticles // 홈페이지 최신 아티클
  ],

  // 특정 아티클 수정 시 (관리자만)
  articleUpdate: (articleId: string): CacheTagType[] => [
    CacheTags.allArticles, // 전체 아티클 목록
    CacheTags.article(articleId), // 해당 아티클 상세 페이지
    CacheTags.homeArticles // 홈페이지 최신 아티클 (최신 3개에 포함될 수 있음)
  ],

  // 이벤트 작성/삭제 시 (관리자만)
  eventCreate: (): CacheTagType[] => [
    CacheTags.allEvents, // 전체 이벤트 목록
    CacheTags.homeBanner // 홈페이지 배너
  ],

  // 특정 이벤트 수정 시 (관리자만)
  eventUpdate: (eventId: string): CacheTagType[] => [
    CacheTags.allEvents, // 전체 이벤트 목록
    CacheTags.event(eventId), // 해당 이벤트 상세 페이지
    CacheTags.homeBanner // 홈페이지 배너 (진행중 이벤트에 포함될 수 있음)
  ],

  // 팔로우/언팔로우 시
  follow: (
    followeruserId: string,
    followinguserId: string
  ): CacheTagType[] => [
    CacheTags.garden(followeruserId), // 팔로워의 garden 페이지
    CacheTags.garden(followinguserId) // 팔로잉 대상의 garden 페이지
  ],

  // 좋아요/좋아요 취소 시
  like: (contentOwneruserId: string): CacheTagType[] => [
    CacheTags.garden(contentOwneruserId), // 콘텐츠 소유자의 garden 페이지 (좋아요 수 변경)
    CacheTags.userContent(contentOwneruserId) // 해당 사용자의 모든 콘텐츠 (좋아요 수 표시)
  ],

  // 알림 생성/읽음 처리 시
  notification: (userId: string): CacheTagType[] => [
    CacheTags.notifications(userId) // 해당 사용자의 알림 목록
  ]
} as const;

/**
 * 캐시 무효화 헬퍼 함수
 * @param type 무효화 타입
 * @param userId 사용자 userId
 * @param additionalParams 추가 파라미터 (follow에서 followinguserId 사용)
 */
export function revalidateUserCache(
  type: keyof typeof InvalidationMap,
  userId: string,
  additionalParams?: { followinguserId?: string }
) {
  let tags: CacheTagType[];

  if (type === 'follow' && additionalParams?.followinguserId) {
    tags = InvalidationMap[type](userId, additionalParams.followinguserId);
  } else if (type === 'articleCreate' || type === 'eventCreate') {
    tags = InvalidationMap[type]();
  } else {
    tags = (InvalidationMap[type] as (userId: string) => CacheTagType[])(
      userId
    );
  }

  // 각 태그에 대해 캐시 무효화 실행
  tags.forEach(tag => {
    console.log(`🔄 Revalidating cache tag: ${tag}`); // 개발 시 디버깅용
    revalidateTag(tag);
  });
}

/**
 * 특정 태그만 무효화하는 헬퍼 함수
 * @param tags 무효화할 태그 배열
 */
export function revalidateSpecificTags(tags: CacheTagType[]) {
  tags.forEach(tag => {
    console.log(`🔄 Revalidating specific tag: ${tag}`);
    revalidateTag(tag);
  });
}

/**
 * 식물 업데이트 시 캐시 무효화
 */
export function revalidatePlantUpdate(userId: string, plantId: string) {
  const tags = InvalidationMap.plantUpdate(userId, plantId);
  revalidateSpecificTags(tags);
}

/**
 * 다이어리 업데이트 시 캐시 무효화
 */
export function revalidateDiaryUpdate(userId: string, diaryId: string) {
  const tags = InvalidationMap.diaryUpdate(userId, diaryId);
  revalidateSpecificTags(tags);
}

/**
 * 갤러리 업데이트 시 캐시 무효화
 */
export function revalidateGalleryUpdate(userId: string, galleryId: string) {
  const tags = InvalidationMap.galleryUpdate(userId, galleryId);
  revalidateSpecificTags(tags);
}

/**
 * 아티클 업데이트 시 캐시 무효화
 */
export function revalidateArticleUpdate(userId: string, articleId: string) {
  const tags = InvalidationMap.articleUpdate(articleId);
  revalidateSpecificTags(tags);
}

/**
 * 이벤트 업데이트 시 캐시 무효화
 */
export function revalidateEventUpdate(userId: string, eventId: string) {
  const tags = InvalidationMap.eventUpdate(eventId);
  revalidateSpecificTags(tags);
}

/**
 * 사용자 관련 모든 캐시 무효화 
 * @param userId 사용자 userId
 */
export function revalidateAllUserCache(userId: string) {
  const allUserTags: CacheTagType[] = [
    CacheTags.garden(userId),
    CacheTags.userContent(userId),
    CacheTags.plants(userId),
    CacheTags.diaries(userId),
    CacheTags.galleries(userId),
    CacheTags.care(userId),
    CacheTags.notifications(userId)
  ];

  revalidateSpecificTags(allUserTags);
}
