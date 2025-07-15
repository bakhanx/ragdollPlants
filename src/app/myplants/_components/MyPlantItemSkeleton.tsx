import React from 'react';
import { Skeleton } from '@/app/_components/common/Skeleton';

export default function MyPlantItemSkeleton() {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-lg bg-white shadow-md">
      {/* 이미지 영역 */}
      <div className="relative aspect-square w-full overflow-hidden">
        <Skeleton
          className="h-full w-full"
          rounded="none"
        />

        {/* 물/영양 아이콘 */}
        {/* <div className="absolute top-2 right-2 flex space-y-1 gap-x-2">
          <div className="rounded-full bg-blue-100 p-1.5">
            <Skeleton width="w-4" height="h-4" rounded="full" />
          </div>
          <div className="rounded-full bg-amber-100 p-1.5">
            <Skeleton width="w-4" height="h-4" rounded="full" />
          </div>
        </div> */}
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex flex-col gap-y-1 p-2">
        <div className="h-5">
          <Skeleton
            width="w-3/4"
            height="h-5"
          />
        </div>
        <div className="h-4">
          <Skeleton
            width="w-1/2"
            height="h-4"
          />
        </div>
      </div>
    </div>
  );
}
