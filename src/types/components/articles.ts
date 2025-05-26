/**
 * Article 관련 컴포넌트 Props 타입 정의
 */
import { Article, ArticlePreview } from '../models/article';

// 아티클 목록 컴포넌트 Props
export interface ArticleListProps {
  items: ArticlePreview[];
  showCategory?: boolean;
  onItemClick?: (id: string) => void;
  maxItems?: number;
}

// 아티클 항목 컴포넌트 Props
export interface ArticleItemProps {
  article: ArticlePreview;
  showDetails?: boolean;
}

// 아티클 내용 컴포넌트 Props
export interface ArticleContentProps {
  article: Article;
}

// 아티클 이미지 컴포넌트 Props
export interface ArticleImageProps {
  src: string;
  alt?: string;
  isHero?: boolean;
}

// 카테고리 배지 컴포넌트 Props
export interface CategoryBadgeProps {
  category: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// 아티클 폼 컴포넌트 Props (생성 및 수정에 모두 사용)
export interface ArticleFormProps {
  initialData?: Partial<Article>;
  onSubmit: (data: Article) => Promise<void>;
  isLoading?: boolean;
  categories?: string[];
} 