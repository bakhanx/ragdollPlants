import { Gallery } from '@prisma/client';

// 기본 Gallery 타입 (Prisma 기반)
export type GalleryWithAuthor = Gallery & {
  author: {
    id: string;
    name: string;
    image: string | null;
  };
  plant?: {
    id: string;
    name: string;
  } | null;
  likes?: number;
  isLiked?: boolean;
  isOwner?: boolean;
};

// 캐시된 Gallery 타입 (Date → string 변환됨)
export type CachedGallery = Omit<GalleryWithAuthor, 
  'createdAt' | 'updatedAt'
> & {
  createdAt: string;
  updatedAt: string;
};

// Gallery 목록 응답 타입
export type GalleriesResponse = {
  galleries: CachedGallery[];
  isOwner?: boolean;
};

// 갤러리 메인 페이지용 응답 타입
export type PublicGalleriesResponse = CachedGallery[];