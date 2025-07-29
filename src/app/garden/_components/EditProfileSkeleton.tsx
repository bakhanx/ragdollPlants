import React from 'react';
import { Skeleton } from '@/app/_components/common/Skeleton';

export const EditProfileSkeleton = () => {
  return (
    <div className="space-y-5 rounded-xl border border-green-100 bg-white/30 p-5">
      {/* 제목 */}
      <Skeleton width="w-32" height="h-6" />

      {/* 프로필 이미지 영역 */}
      <div className="mb-6 flex flex-col items-center">
        <div className="my-2">
          <Skeleton width="w-24" height="h-24" rounded="lg" />
        </div>
        <Skeleton width="w-20" height="h-8" className="mt-3" />
      </div>

      {/* 폼 필드들 */}
      <div className="space-y-4">
        {/* 이름 필드 */}
        <div>
          <Skeleton width="w-12" height="h-4" className="mb-2" />
          <Skeleton width="w-full" height="h-10" />
        </div>

        {/* 이메일 필드 */}
        <div>
          <Skeleton width="w-16" height="h-4" className="mb-2" />
          <Skeleton width="w-full" height="h-10" />
          <Skeleton width="w-32" height="h-3" className="mt-1" />
        </div>

        {/* 자기소개 필드 */}
        <div>
          <Skeleton width="w-20" height="h-4" className="mb-2" />
          <Skeleton width="w-full" height="h-20" />
        </div>

        {/* 관심사 선택 */}
        <div>
          <Skeleton width="w-48" height="h-4" className="mb-2" />
          <div className="flex flex-wrap gap-2 rounded-md border border-gray-300 p-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} width="w-16" height="h-6" rounded="md" />
            ))}
          </div>
          <Skeleton width="w-24" height="h-3" className="mt-1" />
        </div>

        {/* 버튼들 */}
        <div className="flex gap-3 pt-2">
          <Skeleton width="w-full" height="h-10" />
          <Skeleton width="w-full" height="h-10" />
        </div>
      </div>
    </div>
  );
};