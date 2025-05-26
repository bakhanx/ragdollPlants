/**
 * Article 서비스 관련 타입 정의
 * Prisma와 Supabase 연동을 위한 서비스 레이어
 */
import { Article, ArticleCreateInput, ArticleUpdateInput, ArticlePreview } from '../models/article';

// 아티클 목록 요청 파라미터
export interface ArticleListParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
  authorId?: string;
}

// 아티클 목록 응답
export interface ArticleListResponse {
  items: ArticlePreview[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

// 아티클 서비스 인터페이스
export interface ArticleService {
  // 아티클 목록 조회
  getArticles: (params?: ArticleListParams) => Promise<ArticleListResponse>;
  
  // 특정 아티클 조회
  getArticleById: (id: string) => Promise<Article | null>;
  
  // 아티클 생성
  createArticle: (data: ArticleCreateInput) => Promise<Article>;
  
  // 아티클 수정
  updateArticle: (id: string, data: ArticleUpdateInput) => Promise<Article>;
  
  // 아티클 삭제
  deleteArticle: (id: string) => Promise<boolean>;
}

// Supabase 사용 시 필요한 추가 타입
export interface SupabaseArticleData {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  image_url: string | null;
  category: string;
  tags: string[] | null;
  author_id: string;
  is_published: boolean;
  view_count: number;
  likes: number;
  created_at: string;
  updated_at: string;
} 