import { Plant } from '@prisma/client';

// 기본 Plant 타입 (Prisma 기반)
export type PlantWithAuthor = Plant & {
  author: {
    id: string;
    name: string;
    image: string | null;
  };
  likes?: number;
  isLiked?: boolean;
  isOwner?: boolean;
};

// 캐시된 Plant 타입 (Date → string 변환됨)
export type CachedPlant = Omit<PlantWithAuthor, 
  'purchaseDate' | 'lastWateredDate' | 'nextWateringDate' | 
  'lastNutrientDate' | 'nextNutrientDate' | 'createdAt' | 'updatedAt'
> & {
  purchaseDate: string | null;
  lastWateredDate: string | null;
  nextWateringDate: string | null;
  lastNutrientDate: string | null;
  nextNutrientDate: string | null;
  createdAt: string;
  updatedAt: string;
};

// Plant 목록 응답 타입
export type PlantsResponse = {
  plants: CachedPlant[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};