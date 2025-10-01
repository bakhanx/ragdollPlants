import React from 'react';
import Link from 'next/link';
import { formatDateKorean, formatTimeOnly } from '@/app/_utils/dateUtils';

interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string;
}

interface DiaryListProps {
  plantId: string;
  diaries: DiaryEntry[];
}

export const DiaryList = ({ plantId, diaries }: DiaryListProps) => {
  return (
    <div className="py-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-50">최근 일기</h2>
        <Link
          href={`/diaries?plantId=${plantId}`}
          className="text-sm text-green-500 hover:text-green-600">
          모두 보기
        </Link>
      </div>

      <div className="space-y-3">
        {diaries.map(diary => (
          <Link
            key={diary.id}
            href={`/diaries/${diary.id}`}
            className="flex rounded-lg bg-white p-3 shadow-sm hover:bg-gray-50">
            <div className="flex flex-1 flex-col py-1">
              <h3 className="mb-1 line-clamp-1 leading-none font-medium sm:text-base text-sm">
                {diary.title}
              </h3>
              <p className="line-clamp-2  text-xs sm:text-sm text-gray-600">
                {diary.content}
              </p>
            </div>

            <div className="ml-8 flex flex-col py-1 text-right text-xs text-gray-500">
              <div className="leading-none">
                {formatDateKorean(diary.date)}
              </div>
              <div className="mt-1">{formatTimeOnly(diary.date)}</div>
            </div>
          </Link>
        ))}
      </div>

      {diaries.length === 0 && (
        <div className="py-8 text-center text-gray-100">
          <p>아직 작성된 일기가 없습니다.</p>
        </div>
      )}

      <div className="mt-4 text-center">
        <Link
          href={`/diaries/upload?plantId=${plantId}`}
          className="inline-block rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">
          일기 작성하기
        </Link>
      </div>
    </div>
  );
};
