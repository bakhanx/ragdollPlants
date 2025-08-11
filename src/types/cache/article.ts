import { Article } from '@prisma/client';

// 기본 Article 타입 (Prisma 기반)
export type ArticleWithAuthor = Article & {
  author: {
    id: string;
    name: string;
    image: string | null;
  };
  category: {
    id: string;
    name: string;
    color: string | null;
  };
  likes?: number;
  isLiked?: boolean;
  isOwner?: boolean;
};

// 캐시된 Article 타입 (Date → string 변환됨)
export type CachedArticle = Omit<ArticleWithAuthor, 
  'createdAt' | 'updatedAt'
> & {
  createdAt: string;
  updatedAt: string;
};

// Article 목록 응답 타입
export type ArticlesResponse = {
  articles: CachedArticle[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

// 공개 Article 목록 응답 타입 (페이지네이션 없음)
export type PublicArticlesResponse = CachedArticle[];