import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { CachedArticle } from '@/types/cache/article';
import { formatDate } from '@/app/_utils/dateUtils';

type ArticleListProps = {
  items: CachedArticle[];
};

export const ArticleList = ({ items }: ArticleListProps) => {
  if (!items || items.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between">
          <h2 className="py-2 text-lg font-bold">최신 기사</h2>
          <Link
            href="/articles"
            className="text-sm text-green-700 hover:text-green-500 hover:underline">
            더보기
          </Link>
        </div>
        <div className="w-full">
          <div className="flex w-full max-w-md flex-col items-center justify-center rounded-md bg-[#ffffffa5] py-8 shadow-xl">
            <p className="text-gray-600">등록된 기사가 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="py-2 text-lg font-bold">최신 기사</h2>
        <Link
          href="/articles"
          className="text-sm text-green-700 hover:text-green-500 hover:underline">
          더보기
        </Link>
      </div>

      <div className="w-full">
        <div className="flex w-full max-w-md flex-col gap-4">
          {items.slice(0, 3).map(article => (
            <Link
              href={`/articles/${article.id}`}
              key={article.id}>
              <div className="relative flex gap-x-2 rounded-md bg-[#ffffffa5] shadow-xl hover:text-green-600">
                <div className="flex w-full items-center justify-between px-3">
                  <h2 className="cursor-pointer truncate py-2 font-semibold underline">
                    {article.title}
                  </h2>
                  <div className="text-sm text-gray-600">
                    {formatDate(article.createdAt)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
