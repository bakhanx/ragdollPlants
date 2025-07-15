import React from 'react';
import { Skeleton } from '@/app/_components/common/Skeleton';
import MyPlantItemSkeleton from './MyPlantItemSkeleton';

export default function MyPlantCardsSkeleton() {
  return (
    <div className="py-8">
      {/* 식물 카드 그리드 */}
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <MyPlantItemSkeleton key={index} />
        ))}
      </div>

      {/* 페이지네이션 */}
      {/* <div className="mt-8 flex justify-center">
        <div className="flex items-center gap-2">
          <Skeleton width="w-8" height="h-8" rounded="md" />
          <Skeleton width="w-8" height="h-8" rounded="md" />
          <Skeleton width="w-8" height="h-8" rounded="md" />
          <Skeleton width="w-8" height="h-8" rounded="md" />
          <Skeleton width="w-8" height="h-8" rounded="md" />
        </div>
      </div> */}
    </div>
  );
}
