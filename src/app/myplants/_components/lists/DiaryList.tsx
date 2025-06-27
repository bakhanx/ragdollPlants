import React from 'react';
import Link from 'next/link';
import { formatDateKorean } from '@/app/_utils/dateUtils';

interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  image: string | null;
  status: string;
  date: Date;
  plantId: string | null;
  tags: string[];
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  plant: {
    id: string;
    name: string;
  } | null;
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
            className="flex items-start rounded-lg bg-white p-3 shadow-sm hover:bg-gray-50">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{diary.title}</h3>
                <span className="text-xs text-gray-500">
                  {formatDateKorean(diary.date.toISOString().split('T')[0])}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                {diary.content.length > 100
                  ? diary.content.substring(0, 100) + '...'
                  : diary.content}
              </p>
            </div>
            {diary.image && (
              <div className="ml-3 flex h-12 w-12 items-center justify-center rounded bg-gray-100 text-xs text-gray-500">
                사진
              </div>
            )}
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
