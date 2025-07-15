import React from 'react';
import { Skeleton } from '@/app/_components/common/Skeleton';
import DiaryItemSkeleton from './DiaryItemSkeleton';

export default function DiaryCardsSkeleton() {
  return (
    <div className="py-8">
      {/* 다이어리 카드 그리드 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <DiaryItemSkeleton key={index} index={index} />
        ))}
      </div>
      
      {/* 페이지네이션 */}
      <div className="mt-8 flex justify-center">
        <div className="flex items-center gap-2">
          <Skeleton width="w-8" height="h-8" rounded="md" />
          <Skeleton width="w-8" height="h-8" rounded="md" />
          <Skeleton width="w-8" height="h-8" rounded="md" />
          <Skeleton width="w-8" height="h-8" rounded="md" />
          <Skeleton width="w-8" height="h-8" rounded="md" />
        </div>
      </div>
    </div>
  );
}