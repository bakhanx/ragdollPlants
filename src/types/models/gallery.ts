/**
 * Gallery 모델 타입 정의
 * Prisma와 Supabase를 고려한 구조
 */

// 권장 패턴:
// 1. 객체 모델: interface 사용
// 2. 유니온/리터럴 타입: type 사용
// 3. 임시/변환 타입: type 사용 (접두사 Legacy 또는 접미사 Compat 추가)

/**
 * 기본 Gallery 인터페이스
 */
export interface Gallery {
  id: string | number;
  title: string;
  image: string;
  createdAt: string;
  likes: number;
  description?: string;
  authorId?: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  plantId?: string;
  plantName?: string;
  tags?: string[];
  updatedAt?: string;
}

/**
 * 목록에서 사용할 간소화된 Gallery 타입
 */
export interface GalleryPreview {
  id: string | number;
  title: string;
  image: string;
  createdAt: string;
  likes: number;
}

/**
 * 레거시 GalleryItem 타입과의 호환을 위한 타입
 */
export interface LegacyGalleryItem {
  id: number;
  title: string;
  imageUrl: string;
  createdAt: string;
  likes: number;
}

/**
 * Prisma에서 사용할 Gallery 생성 타입
 */
export interface GalleryCreateInput {
  title: string;
  image: string;
  description?: string;
  authorId?: string;
  plantId?: string;
  plantName?: string;
  tags?: string[];
}

/**
 * Prisma에서 사용할 Gallery 수정 타입
 */
export interface GalleryUpdateInput {
  title?: string;
  image?: string;
  description?: string;
  plantId?: string;
  plantName?: string;
  tags?: string[];
}

/**
 * 갤러리 최대 개수 제한
 */
export const MAX_GALLERY_PHOTOS = 10; 