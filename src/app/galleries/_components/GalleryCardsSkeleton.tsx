import React from 'react';
import { Skeleton } from '@/app/_components/common/Skeleton';

export default function GalleryCardsSkeleton() {
  return (
    <div className="mx-auto w-full max-w-md px-4 pb-20">
      {/* 대표 작품 */}
      <div className="mb-6">
        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
          <div className="relative aspect-[4/3]">
            <Skeleton
              className="h-full w-full"
              rounded="none"
            />

            {/* 그라데이션 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
              <div className="absolute bottom-0 w-full p-6">
                <div className="mb-2 flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-400"></div>
                  <Skeleton
                    width="w-16"
                    height="h-3"
                  />
                </div>
                <Skeleton
                  width="w-3/4"
                  height="h-6"
                  className="mb-2"
                />
                <div className="flex items-center justify-between">
                  <Skeleton
                    width="w-20"
                    height="h-4"
                  />
                  <Skeleton
                    width="w-12"
                    height="h-4"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 컴팩트 그리드 갤러리 */}
      <div className="space-y-6">
        {/* 섹션 타이틀 */}
        <div className="flex items-center justify-between">
          <Skeleton
            width="w-24"
            height="h-6"
          />
          <Skeleton
            width="w-16"
            height="h-4"
          />
        </div>

        {/* 3x3 그리드 */}
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg shadow-lg">
              <div className="relative aspect-square">
                <Skeleton
                  className="h-full w-full"
                  rounded="lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
