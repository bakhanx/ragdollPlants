'use client';

import React from 'react';
import DiaryStatus from './DiaryStatus';
import { DiaryMoodStatus } from '@/types/models/diary';
import { formatDateKorean, formatTimeOnly } from '@/app/_utils/dateUtils';

export interface DiaryDetailType {
  id: string;
  title: string;
  content: string;
  date: string;
  authorName: string;
  status: DiaryMoodStatus;
}

interface DiaryContentProps {
  diary: DiaryDetailType;
}

/**
 * 일기 콘텐츠 컴포넌트
 * 일기의 제목, 날짜, 작성자, 상태, 내용을 표시합니다.
 */
export default function DiaryContent({ diary }: DiaryContentProps) {
  const { title, date, authorName, status, content } = diary;

  return (
    <div className="relative z-10 -mt-10 min-h-[40vh] rounded-t-3xl bg-white/90 p-8 shadow-lg backdrop-blur-sm">
      {/* 제목과 날짜/시간 */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <time className="block mt-1 text-sm text-gray-500">
          {formatDateKorean(date)} {formatTimeOnly(date)}
        </time>
      </div>

      {/* 작성자와 상태 */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-gray-500">작성자: {authorName}</span>
        <span className="flex items-center gap-2 text-sm text-gray-700">
          상태: <DiaryStatus status={status} />
        </span>
      </div>

      {/* 내용 */}
      <p className="text-base leading-relaxed whitespace-pre-line text-gray-600">
        {content}
      </p>
    </div>
  );
}
