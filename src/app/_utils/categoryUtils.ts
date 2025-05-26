/**
 * 기사의 카테고리를 결정하는 유틸리티 함수들
 */
import { ArticleCategory } from '@/types/models/article';

/**
 * 기사 제목, 내용, 태그를 분석하여 카테고리를 추론합니다
 */
export function inferArticleCategory(
  title: string,
  content?: string,
  tags?: string[]
): ArticleCategory {
  const lowerTitle = title.toLowerCase();
  
  // 제목 기반 분류
  if (
    lowerTitle.includes('팁') || 
    lowerTitle.includes('tip') || 
    lowerTitle.includes('방법') || 
    lowerTitle.includes('관리') ||
    lowerTitle.includes('예방') ||
    lowerTitle.startsWith('[tip]')
  ) {
    return 'tips';
  } 
  
  if (
    lowerTitle.includes('가이드') || 
    lowerTitle.includes('guide') || 
    lowerTitle.includes('키우기') || 
    lowerTitle.includes('초보자')
  ) {
    return 'guide';
  }
  
  // 내용 기반 분류 (옵션)
  if (content) {
    const lowerContent = content.toLowerCase();
    
    if (
      lowerContent.includes('팁') ||
      lowerContent.includes('방법') ||
      lowerContent.includes('요령')
    ) {
      return 'tips';
    }
    
    if (
      lowerContent.includes('가이드') ||
      lowerContent.includes('초보자') ||
      lowerContent.includes('입문')
    ) {
      return 'guide';
    }
  }
  
  // 태그 기반 분류
  if (tags && tags.length > 0) {
    if (tags.some(tag => 
      ['팁', '관리', '예방', '방법'].includes(tag)
    )) {
      return 'tips';
    } 
    
    if (tags.some(tag => 
      ['가이드', '입문', '초보'].includes(tag)
    )) {
      return 'guide';
    }
  }
  
  // 기본값: 뉴스
  return 'news';
}

/**
 * 카테고리별 배경색, 텍스트색 설정을 반환합니다
 */
export function getCategoryColors(category: ArticleCategory): { bg: string, text: string } {
  const colorMap: Record<ArticleCategory, { bg: string, text: string }> = {
    tips: { bg: 'bg-blue-100', text: 'text-blue-800' },
    news: { bg: 'bg-amber-100', text: 'text-amber-800' },
    guide: { bg: 'bg-emerald-100', text: 'text-emerald-800' }
  };
  
  return colorMap[category];
}

/**
 * 카테고리 한글 이름을 반환합니다
 */
export function getCategoryLabel(category: ArticleCategory): string {
  const labelMap: Record<ArticleCategory, string> = {
    tips: '팁과 정보',
    news: '뉴스',
    guide: '가이드'
  };
  
  return labelMap[category];
} 