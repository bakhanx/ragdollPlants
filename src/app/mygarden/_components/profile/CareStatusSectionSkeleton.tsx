import React from 'react';
import { Skeleton } from '@/app/_components/common/Skeleton';

export const CareStatusSectionSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index}>
          <div className="rounded-xl bg-white/50 p-4 shadow-sm backdrop-blur-sm">
            <div className="flex flex-col gap-y-2 py-1">
              <Skeleton
                width="w-16"
                height="h-4"
                className=""
              />
              <Skeleton
                width="w-16"
                height="h-4"
                className=""
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
