/**
 * 캐시 관리 시스템 통합 export
 */

// 캐시 태그 체계
export { CacheTags, type CacheTagType } from './cacheTags';

// 캐시 무효화 함수들
export {
  InvalidationMap,
  revalidateUserCache,
  revalidateSpecificTags,
  revalidateAllUserCache
} from './cacheInvalidation';

