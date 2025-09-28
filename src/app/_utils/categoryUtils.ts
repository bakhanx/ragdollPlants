/**
 * 기사 카테고리를 결정 유틸리티 함수
 */
import { ArticleCategory } from '@/types/models/article';

/**
 * 기사 제목, 내용, 태그를 분석
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
    return 'TIPS';
  }

  if (
    lowerTitle.includes('가이드') ||
    lowerTitle.includes('guide') ||
    lowerTitle.includes('키우기') ||
    lowerTitle.includes('초보자')
  ) {
    return 'GUIDE';
  }

  // 내용 기반 분류 (옵션)
  if (content) {
    const lowerContent = content.toLowerCase();

    if (
      lowerContent.includes('팁') ||
      lowerContent.includes('방법') ||
      lowerContent.includes('요령')
    ) {
      return 'TIPS';
    }

    if (
      lowerContent.includes('가이드') ||
      lowerContent.includes('초보자') ||
      lowerContent.includes('입문')
    ) {
      return 'GUIDE';
    }
  }

  // 태그 기반 분류
  if (tags && tags.length > 0) {
    if (tags.some(tag => ['팁', '관리', '예방', '방법'].includes(tag))) {
      return 'TIPS';
    }

    if (tags.some(tag => ['가이드', '입문', '초보'].includes(tag))) {
      return 'GUIDE';
    }
  }

  // 기본값: 뉴스
  return 'NEWS';
}

/**
 * 카테고리별 배경색, 텍스트색 설정
 */
export function getCategoryColors(category: ArticleCategory | string): {
  bg: string;
  text: string;
} {
  const colorMap: Record<string, { bg: string; text: string }> = {
    'NEWS': { bg: 'bg-amber-100', text: 'text-amber-800' },
    'TIPS': { bg: 'bg-blue-100', text: 'text-blue-800' },
    'GUIDE': { bg: 'bg-emerald-100', text: 'text-emerald-800' }
  };

  return colorMap[category] || { bg: 'bg-gray-100', text: 'text-gray-800' };
}

/**
 * 카테고리 한글 이름
 */
export function getCategoryLabel(category: ArticleCategory | string): string {
  const labelMap: Record<string, string> = {
    'NEWS': '뉴스',
    'TIPS': '팁과 정보',
    'GUIDE': '가이드'
  };

  return labelMap[category] || '기타';
}
