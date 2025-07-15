import React from 'react';
import { Skeleton } from '@/app/_components/common/Skeleton';

export const ArticleListSkeleton = () => {
  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="py-2 text-lg font-bold">최신 기사</h2>
        <Skeleton
          width="w-12"
          height="h-4"
        />
      </div>

      {/* 기사 목록 스켈레톤 */}
      <div className="w-full">
        <div className="flex w-full max-w-md flex-col gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="relative flex gap-x-2 rounded-md bg-[#ffffffa5] shadow-xl">
              <div className="flex w-full items-center justify-between px-3">
                <div className="flex-1 py-2">
                  <Skeleton
                    width="w-3/4"
                    height="h-6"
                  />
                </div>
                <div className="ml-4">
                  <Skeleton
                    width="w-16"
                    height="h-5"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
