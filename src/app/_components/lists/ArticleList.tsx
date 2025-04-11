import Image from 'next/image';
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
    <div className="w-full">
      <div className="py-2 text-lg font-bold">Article</div>

      <div className="flex w-full max-w-md flex-col gap-4">
        {items.slice(0, 4).map((plant, index) => (
          <div
            key={index}
            className="relative flex gap-x-2 rounded-md bg-[#ffffffa5] shadow-xl">
            <div className="flex w-full items-center justify-between px-3">
              <h2 className="cursor-pointer truncate py-2 font-semibold underline hover:text-green-600">
                {plant.title}
              </h2>
              <div className="text-sm text-gray-600">{plant.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
