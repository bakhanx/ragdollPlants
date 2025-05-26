/**
 * Gallery 관련 컴포넌트 Props 타입 정의
 */

import { Gallery, GalleryPreview, LegacyGalleryItem } from '../models/gallery';

/**
 * 갤러리 그리드 컴포넌트 Props
 */
export interface GalleryGridProps {
  items: LegacyGalleryItem[];
}

/**
 * 갤러리 제목 섹션 컴포넌트 Props
 */
export interface GalleryTitleSectionProps {
  photoCount: number;
}

/**
 * 갤러리 아이템 컴포넌트 Props
 */
export interface GalleryItemProps {
  item: LegacyGalleryItem;
  index: number;
}

/**
 * 갤러리 상세 컴포넌트 Props
 */
export interface GalleryDetailProps {
  gallery: Gallery;
}

/**
 * 갤러리 폼 컴포넌트 Props (생성 및 수정에 모두 사용)
 */
export interface GalleryFormProps {
  initialData?: Partial<Gallery>;
  onSubmit: (data: Gallery) => Promise<void>;
  isLoading?: boolean;
} 