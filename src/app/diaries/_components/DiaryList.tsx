'use client';

import { useFilteredItems } from '@/app/_hooks/useFilteredItems';
import { SearchInput } from '@/app/_components/common/SearchInput';
import { UploadButton } from '@/app/_components/common/UploadButton';
import { Pagination } from '@/app/_components/common/Pagination';
import DiaryItem from './DiaryItem';
import { DiaryListProps } from '@/types/components/diaries';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export default function DiaryList({ 
  diariesData, 
  currentPage, 
  searchQuery 
}: DiaryListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 검색 핸들러
  const handleSearch = useCallback((query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    params.delete('page'); // 검색 시 첫 페이지로
    router.push(`/diaries?${params.toString()}`);
  }, [router, searchParams]);

  // 페이지 변경 핸들러
  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/diaries?${params.toString()}`);
  }, [router, searchParams]);

  if (!diariesData) {
    return (
      <div className="py-8">
        <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-gray-50 text-center">
          <p className="mb-2 text-gray-200">다이어리를 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const { diaries, pagination } = diariesData;
  const maxDiaries = 99;

  return (
    <div className="py-8">
      <div className="mt-4 mb-6 flex justify-between">
        <div className="w-full max-w-xs">
          <SearchInput
            onSearch={handleSearch}
            placeholder="일기 제목 검색"
            defaultValue={searchQuery}
          />
        </div>
        <UploadButton
          link="/diaries/upload"
          title="일기 작성"
          count={pagination.totalCount}
          maxCount={maxDiaries}
        />
      </div>
      
      {diaries.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {diaries.map((post, index) => (
              <DiaryItem
                key={post.id}
                post={post}
                index={index}
              />
            ))}
          </div>
          
          {/* 페이지네이션 */}
          {pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-gray-50 text-center">
          <p className="mb-2 text-gray-200">
            {searchQuery ? '검색 결과가 없습니다.' : '작성된 일기가 없습니다.'}
          </p>
        </div>
      )}
    </div>
  );
}
