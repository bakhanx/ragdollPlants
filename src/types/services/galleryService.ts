/**
 * Gallery 관련 서비스 레이어 타입 정의
 */

import { Gallery, GalleryPreview, GalleryCreateInput, GalleryUpdateInput } from '../models/gallery';

/**
 * 갤러리 필터링 옵션
 */
export interface GalleryFilterOptions {
  authorId?: string;
  plantId?: string;
  searchQuery?: string;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}

/**
 * 갤러리 정렬 옵션
 */
export type GallerySortOption = 'createdAt' | 'title' | 'likes';

/**
 * 정렬 방향
 */
export type SortDirection = 'asc' | 'desc';

/**
 * 페이지네이션 결과
 */
export interface PaginatedGalleries {
  galleries: GalleryPreview[];
  total: number;
  hasMore: boolean;
  nextOffset?: number;
}

/**
 * 갤러리 서비스 인터페이스
 */
export interface GalleryService {
  getAllGalleries(options?: GalleryFilterOptions): Promise<PaginatedGalleries>;
  getGalleryById(id: string | number): Promise<Gallery | null>;
  createGallery(data: GalleryCreateInput): Promise<Gallery>;
  updateGallery(id: string | number, data: GalleryUpdateInput): Promise<Gallery>;
  deleteGallery(id: string | number): Promise<boolean>;
  likeGallery(id: string | number, userId: string): Promise<boolean>;
  unlikeGallery(id: string | number, userId: string): Promise<boolean>;
  getGalleryLikes(id: string | number): Promise<number>;
} 