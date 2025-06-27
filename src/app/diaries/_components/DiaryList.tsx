'use client';

import { useFilteredItems } from '@/app/_hooks/useFilteredItems';
import { SearchInput } from '@/app/_components/common/SearchInput';
import { LoadMoreButton } from '@/app/_components/common/LoadMoreButton';
import { UploadButton } from '@/app/_components/common/UploadButton';
import DiaryItem from './DiaryItem';
import { DiaryListProps } from '@/types/components/diaries';
import { Diary } from '@/types/models/diary';

export default function DiaryList({ initialPosts }: DiaryListProps) {
  // 검색/더보기 등 상태 관리
  const { visibleItems, hasMore, handleSearch, handleLoadMore } =
    useFilteredItems<Diary>({
      items: initialPosts,
      filterFn: (item, query) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.content.toLowerCase().includes(query.toLowerCase()) ||
        (item.author?.name?.toLowerCase().includes(query.toLowerCase()) ??
          false)
    });

  const maxPlants = 99;
  const isMax = initialPosts.length >= maxPlants;

  return (
    <div className="py-8">
      <div className="mt-4 mb-6 flex justify-between">
        <div className="w-full max-w-xs">
          <SearchInput
            onSearch={handleSearch}
            placeholder="일기 제목 검색"
          />
        </div>
        <UploadButton
          link="/diaries/upload"
          title="일기 작성"
          count={initialPosts.length}
          maxCount={maxPlants}
        />
      </div>
      {visibleItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 space-y-4 md:grid-cols-2">
            {visibleItems.map((post, index) => (
              <DiaryItem
                key={post.id}
                post={post}
                index={index}
              />
            ))}
          </div>
          {hasMore && (
            <LoadMoreButton
              onClick={handleLoadMore}
              label="더 많은 일기 보기"
            />
          )}
        </>
      ) : (
        <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-gray-50 text-center">
          <p className="mb-2 text-gray-200">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
