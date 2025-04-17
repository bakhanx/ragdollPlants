import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type ArticleListProps = {
  items: {
    id: string;
    title: string;
    image: string;
    date: string;
  }[];
};

export const ArticleList = ({ items }: ArticleListProps) => {
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
          {items.slice(0, 4).map((plant) => (
            <Link
              href={`/articles/${plant.id}`}
              key={plant.id}>
              <div className="relative flex gap-x-2 rounded-md bg-[#ffffffa5] shadow-xl hover:text-green-600">
                <div className="flex w-full items-center justify-between px-3">
                  <h2 className="cursor-pointer truncate py-2 font-semibold underline">
                    {plant.title}
                  </h2>
                  <div className="text-sm text-gray-600">{plant.date}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
