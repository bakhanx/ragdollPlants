/**
 * 아티클 카테고리 상수 정의
 */

export interface ArticleCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  order: number;
}

export const ARTICLE_CATEGORIES: ArticleCategory[] = [
  {
    id: 'news',
    name: '뉴스',
    description: '식물 관련 최신 소식과 업계 동향',
    color: '#f59e0b', // amber-500
    order: 1
  },
  {
    id: 'tips', 
    name: '팁과 정보',
    description: '식물 관리 팁과 유용한 정보',
    color: '#3b82f6', // blue-500
    order: 2
  },
  {
    id: 'guide',
    name: '가이드',
    description: '초보자를 위한 단계별 가이드',
    color: '#10b981', // emerald-500
    order: 3
  }
];

/**
 * 카테고리 ID로 카테고리 정보 조회
 */
export function getCategoryById(id: string): ArticleCategory | undefined {
  return ARTICLE_CATEGORIES.find(category => category.id === id);
}

/**
 * 카테고리 이름으로 카테고리 정보 조회  
 */
export function getCategoryByName(name: string): ArticleCategory | undefined {
  return ARTICLE_CATEGORIES.find(category => category.name === name);
} 