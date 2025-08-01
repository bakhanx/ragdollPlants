'use client';

import React from 'react';
import {
  getCategoryColors,
  getCategoryLabel
} from '@/app/_utils/categoryUtils';
import { ArticleCategory } from '@/types/models/article';
import { CategoryBadgeProps } from '@/types/components/articles';

/**
 * 기사 카테고리를 표시하는 배지 컴포넌트
 */
export default function CategoryBadge({
  category,
  className = '',
  size = 'md'
}: CategoryBadgeProps) {
  const colors = getCategoryColors(category);
  const label = getCategoryLabel(category);

  // 사이즈별 스타일 클래스
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1 text-sm'
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-medium ${colors?.bg || 'bg-gray-100'} ${colors?.text || 'text-gray-800'} ${sizeClasses[size]} ${className} `}>
      {label}
    </span>
  );
}
