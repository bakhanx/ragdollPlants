'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition, useCallback } from 'react';
import { SearchInput } from '@/app/_components/common/SearchInput';
import { Pagination } from '@/app/_components/common/Pagination';
import Image from 'next/image';
import Link from 'next/link';
import { WaterIcon, NutrientIcon } from '@/app/_components/icons/Icons';
import { UploadButton } from '@/app/_components/common/UploadButton';
import { MAX_PLANTS } from '@/types/models/plant';
import { getMyPlants } from '@/app/actions/plants';

interface MyPlantFrom {
  id: string;
  name: string;
  image: string;
  category: string;
  needsWater: boolean;
  needsNutrient: boolean;
  lastWateredDate: Date | null;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface MyPlantListProps {
  plantsData: Awaited<ReturnType<typeof getMyPlants>> | null;
  currentPage: number;
  searchQuery: string;
}

export const MyPlantList = ({
  plantsData,
  currentPage,
  searchQuery
}: MyPlantListProps) => {
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

  // 검색 핸들러
  const handleSearch = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams);

      if (query.trim()) {
        params.set('search', query.trim());
      } else {
        params.delete('search');
      }
      params.delete('page'); // 검색 시 첫 페이지로 리셋

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

  const isMax = totalCount >= MAX_PLANTS;
  const hasPlants = plants.length > 0;
  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="py-8">
      <div className="mt-4 mb-6 flex justify-between">
        <div className="w-full max-w-xs">
          <SearchInput
            onSearch={handleSearch}
            placeholder="식물 이름 또는 종류 검색"
            defaultValue={searchQuery}
          />
        </div>
        <UploadButton
          link="/myplants/upload"
          disabled={isMax}
          count={totalCount}
          maxCount={MAX_PLANTS}
          title="식물 등록"
        />
      </div>

      {/* 식물 목록 - 서버에서 데이터를 가져왔으므로 바로 표시 */}
      {plants.length > 0 ? (
        <div
          className={`grid grid-cols-2 gap-3 transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
          {plants.map((plant: MyPlantFrom) => (
            <Link
              href={`/myplants/${plant.id}`}
              key={plant.id}
              className="relative flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg">
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src={plant.image}
                  alt={plant.name}
                  fill
                  className="object-cover brightness-80 filter transition-all duration-200 hover:brightness-100"
                />
                {/* 물/영양 아이콘 */}
                <div className="absolute top-2 right-2 flex space-y-1 gap-x-2">
                  {plant.needsWater && (
                    <div className="rounded-full bg-blue-100 p-1.5">
                      <WaterIcon
                        size={16}
                        className="[&_path]:fill-blue-600"
                      />
                    </div>
                  )}
                  {plant.needsNutrient && (
                    <div className="rounded-full bg-amber-100 p-1.5">
                      <NutrientIcon
                        size={16}
                        className="[&_path]:fill-amber-600"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="p-2">
                <h3 className="font-medium text-gray-900">{plant.name}</h3>
                <p className="text-xs text-gray-500">{plant.category}</p>{' '}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div
          className={`flex h-40 flex-col items-center justify-center rounded-lg border border-gray-50 text-center transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
          {totalCount === 0 && !isSearching ? (
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

      {/* 페이지네이션 - 검색 결과가 있고 페이지가 2개 이상일 때만 표시 */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};
