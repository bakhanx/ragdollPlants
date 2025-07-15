import React from 'react';
import { Skeleton } from '@/app/_components/common/Skeleton';

export const BannerSkeleton = () => {
  return (
    <div className="mt-4 mb-6">
      <div className="relative w-full max-w-md overflow-hidden rounded-xl">
        {/* 배너 이미지 */}
        <div className="relative h-48 w-full">
          <Skeleton
            className="h-full w-full"
            rounded="none"
          />

          {/* 텍스트 오버레이 */}
          {/* <div className="absolute inset-0 flex flex-col justify-center items-center p-4">
            <Skeleton width="w-3/4" height="h-6" className="mb-2" />
            <Skeleton width="w-1/2" height="h-4" />
          </div> */}
        </div>

        {/* 인디케이터 */}
        {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <Skeleton width="w-2" height="h-2" rounded="full" />
          <Skeleton width="w-2" height="h-2" rounded="full" />
          <Skeleton width="w-2" height="h-2" rounded="full" />
        </div> */}
      </div>
    </div>
  );
};
