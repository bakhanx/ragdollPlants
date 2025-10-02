'use client';

import { Pagination } from '@/app/_components/common/Pagination';
import DiaryItem from './DiaryItem';
import { DiaryListProps } from '@/types/components/diaries';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition, useCallback } from 'react';

export default function DiaryList({
  diariesData,
  searchQuery
}: DiaryListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // 페이지 변경 핸들러
  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', page.toString());
      
      startTransition(() => {
        router.push(`/diaries?${params.toString()}`);
      });
    },
    [router, searchParams, startTransition]
  );

  // 데이터 추출
  const diaries = diariesData?.diaries || [];
  const pagination = diariesData?.pagination;
  const isSearching = searchQuery.trim().length > 0;
  const hasPages = pagination && pagination.totalPages > 1;

  // null 데이터 처리
  if (!diariesData) {
    return (
      <div className="py-8">
        <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-gray-50 text-center">
          <p className="mb-2 text-gray-200">다이어리를 불러오지 못합니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {diaries.length > 0 ? (
        <>
          <div className={`grid grid-cols-2 gap-4 transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
            {diaries.map((post, index) => (
              <DiaryItem
                key={post.id}
                post={post}
                index={index}
              />
            ))}
          </div>

          {/* 페이지네이션 */}
          {hasPages && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination!.currentPage}
                totalPages={pagination!.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        <div className={`flex h-40 flex-col items-center justify-center rounded-lg border border-gray-50 text-center transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
          <p className="mb-2 text-gray-200">
            {isSearching ? '검색 결과가 없습니다.' : '작성된 일기가 없습니다.'}
          </p>
        </div>
      )}
    </div>
  );
}
