/**
 * Article 모델 타입 정의
 * Prisma와 Supabase를 고려한 구조
 */

// 권장 패턴:
// 1. 객체 모델: interface 사용
// 2. 유니온/리터럴 타입: type 사용

// 기본 Article 인터페이스
export interface Article {
  id: string;
  title: string;
  content: string;
  summary?: string;
  image?: string;
  date: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: string;
  tags?: string[];
  isPublished: boolean;
  viewCount?: number;
  likes?: number;
  createdAt?: string;
  updatedAt?: string;
}

// 목록에서 사용할 간소화된 Article 타입
export interface ArticlePreview {
  id: string;
  title: string;
  summary?: string;
  image?: string;
  category: string;
  date: string;
  author?: {
    id: string;
    name: string;
  };
  likes?: number;
}

export type ArticleCategory = 'TIPS' | 'NEWS' | 'GUIDE';

export type ArticleTabType = 'ALL' | ArticleCategory;

// Prisma에서 사용할 Article 생성 타입
export interface ArticleCreateInput {
  title: string;
  content: string;
  summary?: string;
  image?: string;
  category: string;
  tags?: string[];
  authorId: string;
  isPublished?: boolean;
}

// Prisma에서 사용할 Article 수정 타입
export interface ArticleUpdateInput {
  title?: string;
  content?: string;
  summary?: string;
  image?: string;
  category?: string;
  tags?: string[];
  isPublished?: boolean;
}
