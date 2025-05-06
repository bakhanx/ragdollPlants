import React from 'react';
import Link from 'next/link';
import { formatDateKorean } from '@/app/_utils/dateUtils';

interface DiaryEntry {
  id: number;
  date: string;
  title: string;
  hasImage: boolean;
  excerpt: string;
}

interface DiaryListProps {
  plantId: string | number;
  diaries: DiaryEntry[];
}

export const DiaryList: React.FC<DiaryListProps> = ({ plantId, diaries }) => {
  return (
    <div className="py-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">최근 일기</h2>
        <Link
          href={`/diaries?plantId=${plantId}`}
          className="text-sm text-green-600 hover:text-green-700">
          모두 보기
        </Link>
      </div>

      <div className="space-y-3">
        {diaries.map(diary => (
          <Link
            key={diary.id}
            href={`/diaries/${diary.id}`}
            className="flex items-start rounded-lg bg-white p-3 shadow-sm hover:bg-gray-50">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{diary.title}</h3>
                <span className="text-xs text-gray-500">
                  {formatDateKorean(diary.date)}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                {diary.excerpt}
              </p>
            </div>
            {diary.hasImage && (
              <div className="ml-3 flex h-12 w-12 items-center justify-center rounded bg-gray-100 text-xs text-gray-500">
                사진
              </div>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-4 text-center">
        <Link
          href={`/diaries/create?plantId=${plantId}`}
          className="inline-block rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">
          일기 작성하기
        </Link>
      </div>
    </div>
  );
}; 