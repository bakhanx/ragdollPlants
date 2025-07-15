import React from 'react';
import { Skeleton, SkeletonText } from '@/app/_components/common/Skeleton';
import Pin from './Pin';

interface DiaryItemSkeletonProps {
  index: number;
}

export default function DiaryItemSkeleton({ index }: DiaryItemSkeletonProps) {
  return (
    <div className="relative block rounded-lg border border-amber-100 bg-white/80 shadow-md">
      {/* 핀 컴포넌트 */}
      <Pin index={index} />

      <article className="relative flex h-[280px] flex-col">
        {/* 이미지 영역 */}
        <div className="relative h-32 w-full overflow-hidden">
          <div className="absolute inset-0 bg-amber-50/50"></div>
          <Skeleton
            className="h-full w-full"
            rounded="none"
          />

          {/* 날짜 스티커 */}
          <div className="absolute top-3 right-3 rotate-3 rounded-lg border border-amber-200 bg-white/90 px-2 py-1 shadow-sm">
            <Skeleton
              width="w-16"
              height="h-3"
            />
          </div>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="flex-1 overflow-hidden bg-[linear-gradient(transparent_0px,transparent_16px,#c8ccd0_17px)] bg-[size:100%_18px] p-4 pt-2">
          {/* 제목 */}
          <div className="mb-3 rounded bg-amber-50/70 px-1 py-1">
            <Skeleton
              width="w-3/4"
              height="h-6"
            />
          </div>

          <div className="relative">
            {/* 콘텐츠 */}
            <div className="mb-4 px-1">
              <SkeletonText lines={5} />
            </div>

            {/* 접착 테이프 효과 */}
            <div className="absolute -top-2 left-1/2 h-2 w-16 -translate-x-1/2 transform rounded-full bg-amber-100/70"></div>
          </div>
        </div>
      </article>
    </div>
  );
}
