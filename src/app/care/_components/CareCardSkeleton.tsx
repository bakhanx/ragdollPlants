import React from 'react';
import { Skeleton } from '@/app/_components/common/Skeleton';

export const CareCardSkeleton = () => {
  return (
    <div className="rounded-xl bg-white/90 p-4 shadow-sm backdrop-blur-sm">
      {/* 식물 이름 */}
      <div className="pb-2">
        <Skeleton width="w-24" height="h-5" />
      </div>
      
      <div className="flex items-center gap-4">
        {/* 식물 이미지 */}
        <div className="relative size-20 shrink-0 self-start">
          <Skeleton className="w-full h-full" rounded="lg" />
        </div>

        <div className="flex-1 space-y-4">
          {/* 물주기 섹션 */}
          <div className="flex gap-x-2">
            <div className="w-full">
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">남은 물</span>
                </div>
                {/* D-day */}
                <Skeleton width="w-8" height="h-3" />
              </div>
              <div className="space-y-1">
                {/* 프로그레스 바 */}
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <Skeleton className="h-full w-3/4" rounded="none" />
                </div>
                
                <div className="flex items-center justify-between gap-1">
                  <Skeleton width="w-12" height="h-4" />
                  <Skeleton width="w-16" height="h-3" />
                </div>
              </div>
            </div>
            {/* 물주기 버튼 */}
            <div className="flex items-center">
              <Skeleton width="w-10" height="h-10" rounded="full" />
            </div>
          </div>

          {/* 영양제 섹션 */}
          <div className="flex gap-x-2">
            <div className="w-full">
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">남은 영양제</span>
                </div>
                {/* D-day */}
                <Skeleton width="w-8" height="h-3" />
              </div>
              <div className="space-y-1">
                {/* 프로그레스 바 */}
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <Skeleton className="h-full w-1/2" rounded="none" />
                </div>
                
                <div className="flex items-center justify-between gap-1">
                  <Skeleton width="w-14" height="h-4" />
                  <Skeleton width="w-16" height="h-3" />
                </div>
              </div>
            </div>
            {/* 영양제 버튼 */}
            <div className="flex items-center">
              <Skeleton width="w-10" height="h-10" rounded="full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};