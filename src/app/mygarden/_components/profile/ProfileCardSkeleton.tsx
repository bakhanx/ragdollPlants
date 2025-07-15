import React from 'react';
import { Skeleton } from '@/app/_components/common/Skeleton';
import { Card } from '@/app/_components/common/Card';

export const ProfileCardSkeleton = () => {
  return (
    <Card
      className="p-5"
      isHover={false}>
      <div className="relative flex gap-5">
        {/* 프로필 이미지 */}
        <div className="shrink-0">
          <div className="size-20 overflow-hidden rounded-2xl border-2 border-green-200 shadow-lg sm:size-24">
            <Skeleton
              className="h-full w-full"
              rounded="none"
            />
          </div>
        </div>

        {/* 사용자 정보 */}
        <div className="min-w-0 flex-1">
          {/* 닉네임과 레벨 */}
          <div className="mb-4 flex items-center gap-2">
            <Skeleton
              width="w-32"
              height="h-5 sm:h-6"
            />
          </div>

          {/* 통계 그리드 */}
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-lg bg-white/50 px-1.5 py-2 shadow-sm">
                <div className="flex flex-col items-center">
                  <Skeleton
                    width="w-8"
                    height="h-4 sm:h-5"
                    className="mb-1"
                  />
                  <Skeleton
                    width="w-12"
                    height="h-4"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 레벨 프로그레스 */}
      <div className="mt-6">
        <Skeleton
          width="w-24"
          height="h-3 sm:h-4"
          className="mb-1"
        />
        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <Skeleton
            className="h-full w-3/5"
            rounded="none"
          />
        </div>
      </div>

      {/* 관심사 태그들 */}
      <div className="mt-4 flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index}>
            <Skeleton
              width="w-12"
              height="h-6"
              rounded="full"
            />
          </div>
        ))}
      </div>
    </Card>
  );
};
