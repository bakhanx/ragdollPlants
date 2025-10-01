'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition, useCallback } from 'react';
import { Pagination } from '@/app/_components/common/Pagination';
import Link from 'next/link';
import { CachedPlant } from '@/types/cache/plant';
import { MyPlantListProps } from '@/types/components/plants';
import PlantItem from './PlantItem';

export const MyPlantList = ({ plantsData, searchQuery }: MyPlantListProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // 페이지 변경 핸들러
  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', page.toString());

      startTransition(() => {
        router.push(`/myplants?${params.toString()}`);
      });
    },
    [searchParams, router, startTransition]
  );

  // 데이터 추출
  const plants = plantsData?.plants || [];
  const pagination = plantsData?.pagination;
  const totalCount = pagination?.totalCount || 0;
  const isSearching = searchQuery.trim().length > 0;
  const hasPages = pagination && pagination.totalPages > 1;

  // null 데이터 처리
  if (!plantsData) {
    return (
      <div className="py-4">
        <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-gray-50 text-center">
          <p className="mb-2 text-gray-200">식물 목록을 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      {plants.length > 0 ? (
        <>
          <div className={`grid grid-cols-2 gap-3 transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
            {plants.map((plant: CachedPlant) => (
              <PlantItem 
                key={plant.id} 
                plant={plant} 
              />
            ))}
          </div>

          {/* 페이지네이션 */}
          {hasPages && (
            <Pagination
              currentPage={pagination!.currentPage}
              totalPages={pagination!.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className={`flex h-40 flex-col items-center justify-center rounded-lg border border-gray-50 text-center transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
          {!isSearching && totalCount === 0 ? (
            <>
              <p className="mb-2 text-gray-200">등록된 식물이 없습니다.</p>
              <Link
                href="/myplants/upload"
                className="rounded-full bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">
                첫 식물 등록하기
              </Link>
            </>
          ) : isSearching ? (
            <>
              <p className="mb-2 text-gray-200">
                &ldquo;{searchQuery}&rdquo; 검색 결과가 없습니다.
              </p>
              <p className="text-xs text-gray-400">
                다른 검색어를 입력해보세요.
              </p>
            </>
          ) : (
            <p className="mb-2 text-gray-200">표시할 식물이 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
};
