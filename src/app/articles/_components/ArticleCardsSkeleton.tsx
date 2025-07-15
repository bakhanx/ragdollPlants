import React from 'react';
import { Skeleton, SkeletonText } from '@/app/_components/common/Skeleton';

export default function ArticleCardsSkeleton() {
  return (
    <>
      {/* 탭 네비게이션  */}
      <div className="mb-6">
        <div className="flex space-x-1 rounded-lg p-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              width="w-24"
              height="h-8"
              rounded="md"
            />
          ))}
        </div>
      </div>

      {/* 아티클 목록 */}
      <div className="mx-auto w-full">
        <div className="space-y-6">
          {Array.from({ length: 1 }).map((_, index) => (
            <div
              key={index}
              className="block overflow-hidden rounded-2xl bg-white/50 shadow-sm">
              <article className="relative">
                {/* 이미지  */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Skeleton
                    className="h-full w-full"
                    rounded="none"
                  />

                  {/* 카테고리 배지  */}
                  <div className="absolute top-2 right-2 z-10">
                    <Skeleton
                      width="w-16"
                      height="h-6"
                      rounded="full"
                    />
                  </div>
                </div>

                {/* 콘텐츠 */}
                <div className="p-4">
                  {/* 제목  */}
                  <div className="mb-2">
                    <Skeleton
                      width="w-full"
                      height="h-7"
                      className="mb-1"
                    />
                  </div>

                  {/* 내용*/}
                  <div className="mb-3">
                    <Skeleton
                      width="w-4/5"
                      height="h-5"
                    />
                  </div>

                  {/* 메타 정보 */}
                  <div className="flex items-center justify-between text-xs">
                    <Skeleton
                      width="w-20"
                      height="h-4"
                    />
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>

        {/* 더보기 버튼 */}
        {/* <div className="mt-8 text-center">
          <Skeleton
            width="w-32"
            height="h-10"
            rounded="md"
            className="mx-auto"
          />
        </div> */}
      </div>
    </>
  );
}
