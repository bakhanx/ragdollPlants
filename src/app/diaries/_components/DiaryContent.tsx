'use client';

import React from 'react';
import DiaryStatus, { DiaryMoodStatus } from './DiaryStatus';

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
    <div className="relative z-10 -mt-10 min-h-[calc(40vh+40px)] rounded-t-3xl bg-white/90 p-8 shadow-lg backdrop-blur-sm">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <time className="text-sm text-gray-500">{date}</time>
      </div>

      <div className="mb-6 flex items-center">
        <span className="text-sm font-medium text-gray-500">
          작성자: {authorName}
        </span>
      </div>

      <div className="mb-6 rounded-xl">
        <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold text-gray-700">
          상태 : <DiaryStatus status={status} />
        </h2>
      </div>

      <p className="text-base leading-relaxed whitespace-pre-line text-gray-600">
        {content}
      </p>
    </div>
  );
}
