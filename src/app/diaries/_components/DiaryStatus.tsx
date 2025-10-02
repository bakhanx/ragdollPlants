'use client';

import React from 'react';
import { DiaryStatusProps } from '@/types/components/diaries';

/**
 * 일기 상태(기분) 컴포넌트
 * 상태에 따라 다른 이모지와 텍스트를 표시합니다.
 */
export default function DiaryStatus({ status, className = '' }: DiaryStatusProps) {
  // 상태별 표시 정보
  const statusInfo = {
    good: {
      emoji: '😀',
      text: '좋음',
      colorClass: 'text-green-600'
    },
    normal: {
      emoji: '😐',
      text: '보통',
      colorClass: 'text-yellow-600'
    },
    bad: {
      emoji: '😞',
      text: '나쁨',
      colorClass: 'text-red-600'
    }
  };

  const { emoji, text, colorClass } = statusInfo[status];

  return (
    <div className={`flex items-center gap-1 ${colorClass} ${className}`}>
      <span className="text-sm sm:text-base">{emoji}</span>
      <span className="font-medium">{text}</span>
    </div>
  );
} 