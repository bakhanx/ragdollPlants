import React from 'react';
import { Skeleton } from '@/app/_components/common/Skeleton';

export default function EventCardsSkeleton() {
  return (
    <>
      {/* 탭 네비게이션 */}
      <div className="mb-6">
        <div className="flex space-x-1 rounded-lg p-1">
          <Skeleton
            width="w-36"
            height="h-8"
            rounded="md"
          />
          <Skeleton
            width="w-32"
            height="h-8"
            rounded="md"
          />
        </div>
      </div>

      {/* 이벤트 목록 */}
      <div className="mx-auto w-full max-w-md">
        <div className="space-y-4">
          {Array.from({ length: 1 }).map((_, index) => (
            <div
              key={index}
              className="block">
              <div className="relative h-40 w-full overflow-hidden rounded-lg shadow-lg">
                {/* 이미지 */}
                <Skeleton
                  className="h-full w-full"
                  rounded="none"
                />

                {/* 그라데이션 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                {/* 상태 배지 */}
                {/* <div className="absolute top-3 right-3">
                  <Skeleton width="w-12" height="h-6" rounded="md" />
                </div> */}

                {/* 이벤트 정보 */}
                <div className="absolute bottom-0 left-0 z-10 p-4">
                  <div className="mb-1">
                    <Skeleton
                      width="w-24"
                      height="h-4"
                    />
                  </div>
                  <div>
                    <Skeleton
                      width="w-32"
                      height="h-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 더보기 버튼 */}
        {/* <div className="mt-8 text-center">
          <Skeleton width="w-36" height="h-10" rounded="md" className="mx-auto" />
        </div> */}
      </div>
    </>
  );
}
