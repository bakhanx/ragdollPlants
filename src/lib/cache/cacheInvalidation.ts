import { revalidateTag } from 'next/cache';
import { CacheTags, type CacheTagType } from './cacheTags';

/**
 * 데이터 변경 시 무효화해야 할 캐시 태그들의 의존성 매핑
 */
export const InvalidationMap = {
  // 사용자 프로필 변경 시 (이름, 프로필 사진, 소개 등)
  gardenProfile: (loginId: string): CacheTagType[] => [
    CacheTags.garden(loginId), // 해당 사용자의 garden 페이지
    CacheTags.userContent(loginId) // 해당 사용자가 작성한 모든 콘텐츠
  ],

  // 식물 추가/삭제 시
  plantCreate: (loginId: string): CacheTagType[] => [
    CacheTags.garden(loginId), // garden 페이지 (식물 개수)
    CacheTags.plants(loginId), // 해당 사용자의 식물 목록 페이지
    CacheTags.care(loginId) // care 페이지 (식물 목록 변경)
  ],

  // 특정 식물 수정 시 (어떤 필드든 변경 시)
  plantUpdate: (loginId: string, plantId: string): CacheTagType[] => [
    CacheTags.plants(loginId), // 식물 목록 페이지 (이름, 이미지 등 변경 가능)
    CacheTags.plant(plantId), // 해당 식물 상세 페이지
    CacheTags.garden(loginId), // garden 페이지 (관리 필요한 식물 개수 변경 가능)
    CacheTags.care(loginId) // care 페이지 (식물 이름 등 표시)
  ],

  // 다이어리 작성/삭제 시
  diaryCreate: (loginId: string): CacheTagType[] => [
    CacheTags.garden(loginId), // garden 페이지 (다이어리 개수)
    CacheTags.diaries(loginId) // 해당 사용자의 다이어리 목록 페이지
  ],

  // 특정 다이어리 수정 시 (어떤 필드든 변경 시)
  diaryUpdate: (loginId: string, diaryId: string): CacheTagType[] => [
    CacheTags.diaries(loginId), // 다이어리 목록 페이지 (제목, 썸네일 등 변경 가능)
    CacheTags.diary(diaryId), // 해당 다이어리 상세 페이지
    CacheTags.garden(loginId) // garden 페이지 (다이어리 정보 변경 시)
  ],

  // 갤러리 업로드/삭제 시
  galleryCreate: (loginId: string): CacheTagType[] => [
    CacheTags.garden(loginId), // garden 페이지 (갤러리 개수)
    CacheTags.galleries(loginId) // 해당 사용자의 갤러리 목록 페이지
  ],

  // 특정 갤러리 수정 시 (어떤 필드든 변경 시)
  galleryUpdate: (loginId: string, galleryId: string): CacheTagType[] => [
    CacheTags.galleries(loginId), // 갤러리 목록 페이지 (제목, 썸네일 등 변경 가능)
    CacheTags.gallery(galleryId), // 해당 갤러리 상세 페이지
    CacheTags.garden(loginId) // garden 페이지 (갤러리 정보 변경 시)
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
    followerLoginId: string,
    followingLoginId: string
  ): CacheTagType[] => [
    CacheTags.garden(followerLoginId), // 팔로워의 garden 페이지
    CacheTags.garden(followingLoginId) // 팔로잉 대상의 garden 페이지
  ],

  // 좋아요/좋아요 취소 시
  like: (contentOwnerLoginId: string): CacheTagType[] => [
    CacheTags.garden(contentOwnerLoginId), // 콘텐츠 소유자의 garden 페이지 (좋아요 수 변경)
    CacheTags.userContent(contentOwnerLoginId) // 해당 사용자의 모든 콘텐츠 (좋아요 수 표시)
  ],

  // 알림 생성/읽음 처리 시
  notification: (loginId: string): CacheTagType[] => [
    CacheTags.notifications(loginId) // 해당 사용자의 알림 목록
  ]
} as const;

/**
 * 캐시 무효화 헬퍼 함수
 * @param type 무효화 타입
 * @param loginId 사용자 loginId
 * @param additionalParams 추가 파라미터 (follow에서 followingLoginId 사용)
 */
export function revalidateUserCache(
  type: keyof typeof InvalidationMap,
  loginId: string,
  additionalParams?: { followingLoginId?: string }
) {
  let tags: CacheTagType[];

  if (type === 'follow' && additionalParams?.followingLoginId) {
    tags = InvalidationMap[type](loginId, additionalParams.followingLoginId);
  } else if (type === 'articleCreate' || type === 'eventCreate') {
    tags = InvalidationMap[type]();
  } else {
    tags = (InvalidationMap[type] as (loginId: string) => CacheTagType[])(
      loginId
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
export function revalidatePlantUpdate(loginId: string, plantId: string) {
  const tags = InvalidationMap.plantUpdate(loginId, plantId);
  revalidateSpecificTags(tags);
}

/**
 * 다이어리 업데이트 시 캐시 무효화
 */
export function revalidateDiaryUpdate(loginId: string, diaryId: string) {
  const tags = InvalidationMap.diaryUpdate(loginId, diaryId);
  revalidateSpecificTags(tags);
}

/**
 * 갤러리 업데이트 시 캐시 무효화
 */
export function revalidateGalleryUpdate(loginId: string, galleryId: string) {
  const tags = InvalidationMap.galleryUpdate(loginId, galleryId);
  revalidateSpecificTags(tags);
}

/**
 * 아티클 업데이트 시 캐시 무효화
 */
export function revalidateArticleUpdate(loginId: string, articleId: string) {
  const tags = InvalidationMap.articleUpdate(articleId);
  revalidateSpecificTags(tags);
}

/**
 * 이벤트 업데이트 시 캐시 무효화
 */
export function revalidateEventUpdate(loginId: string, eventId: string) {
  const tags = InvalidationMap.eventUpdate(eventId);
  revalidateSpecificTags(tags);
}

/**
 * 사용자 관련 모든 캐시 무효화 (극단적인 경우)
 * @param loginId 사용자 loginId
 */
export function revalidateAllUserCache(loginId: string) {
  const allUserTags: CacheTagType[] = [
    CacheTags.garden(loginId),
    CacheTags.userContent(loginId),
    CacheTags.plants(loginId),
    CacheTags.diaries(loginId),
    CacheTags.galleries(loginId),
    CacheTags.care(loginId),
    CacheTags.notifications(loginId)
  ];

  revalidateSpecificTags(allUserTags);
}
