'use client';

import React from 'react';
import DiaryStatus from './DiaryStatus';
import { DiaryMoodStatus } from '@/types/models/diary';
import { formatDateKorean, formatTimeOnly } from '@/app/_utils/dateUtils';

export interface DiaryDetailType {
  id: string;
  title: string;
  content: string;
  date: Date | string;
  authorName: string;
  status: DiaryMoodStatus;
  plantName?: string;
}

interface DiaryContentProps {
  diary: DiaryDetailType;
}

/**
 * 일기 콘텐츠 컴포넌트
 * 일기의 제목, 날짜, 작성자, 상태, 내용을 표시합니다.
 */
export default function DiaryContent({ diary }: DiaryContentProps) {
  const { title, date, authorName, status, content, plantName } =
    diary;

  return (
    <div className="relative z-0 -mt-10 min-h-[40vh] rounded-t-3xl bg-white/90 p-8 shadow-lg backdrop-blur-sm">
      {/* 제목과 날짜/시간 */}
      <div className="mb-4">
        <h2 className="text-xs text-gray-500">{plantName}</h2>
        <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">{title}</h1>
      </div>

      {/* 작성자와 상태 */}
      <div className=" flex items-center justify-between">
        <span className="text-xs text-gray-500 sm:text-sm">
          작성자: {authorName}
        </span>
        <span className="flex items-center gap-2 text-xs text-gray-700 sm:text-sm">
          상태: <DiaryStatus status={status} />
        </span>
      </div>

      <time className="py-1 block text-xs text-gray-500 sm:text-sm">
        {formatDateKorean(date)} | {formatTimeOnly(date)}
      </time>

      {/* 내용 */}
      <p className="pt-4 text-sm leading-relaxed whitespace-pre-line text-gray-600 sm:text-base">
        {content}
      </p>
    </div>
  );
}
