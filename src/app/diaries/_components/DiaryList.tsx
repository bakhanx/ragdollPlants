'use client';

import { useMemo } from 'react';
import { useFilteredItems } from '@/app/_hooks/useFilteredItems';
import SearchInput from '@/app/_components/common/SearchInput';
import LoadMoreButton from '@/app/_components/common/LoadMoreButton';
import Image from 'next/image';
import Link from 'next/link';
import Pin from './Pin';

export type DiaryPost = {
  id: string;
  title: string;
  content: string;
  date: string;
  imageUrl: string;
  status: string;
  authorName?: string;
};

export default function DiaryList({ initialPosts }: { initialPosts: DiaryPost[] }) {
  // 검색/더보기 등 상태 관리
  const {
    visibleItems,
    hasMore,
    handleSearch,
    handleLoadMore
  } = useFilteredItems<DiaryPost>({
    items: initialPosts,
    filterFn: (item, query) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.content.toLowerCase().includes(query.toLowerCase()) ||
      (item.authorName?.toLowerCase().includes(query.toLowerCase()) ?? false)
  });

  return (
    <div className="py-8">
      <div className="mb-6 flex justify-between items-center">
        <div className="max-w-xs">
          <SearchInput onSearch={handleSearch} placeholder="일기 제목 검색" />
        </div>
      </div>
      {visibleItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 space-y-4 md:grid-cols-2">
            {visibleItems.map((post, index) => (
              <DiaryListItem key={post.id} post={post} index={index} />
            ))}
          </div>
          {hasMore && (
            <LoadMoreButton onClick={handleLoadMore} label="더 많은 일기 보기" />
          )}
        </>
      ) : (
        <div className="mt-4 text-center text-gray-500">검색 결과가 없습니다.</div>
      )}
    </div>
  );
}

// DiaryListItem은 기존 DiaryList의 map 내부 코드를 그대로 분리해서 사용
function DiaryListItem({ post, index }: { post: DiaryPost; index: number }) {
  return (
    <Link
      href={`/diaries/${post.id}`}
      className="relative block rounded-lg border border-amber-100 bg-white/80 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
      {/* 핀 컴포넌트 */}
      <Pin index={index} />

      <article className="relative">
        {/* 이미지 영역 */}
        <div className="relative h-32 w-full overflow-hidden">
          <div className="absolute inset-0 bg-amber-50/50"></div>
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="rounded-t-lg object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* 날짜 스티커 */}
          <div className="absolute top-3 right-3 rotate-3 rounded-lg border border-amber-200 bg-white/90 px-2 py-1 text-xs font-medium text-amber-700 shadow-sm">
            {post.date}
          </div>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="bg-[linear-gradient(transparent_0px,transparent_16px,#c8ccd0_17px)] bg-[size:100%_18px] p-4 pt-2">
          <h2 className="mb-3 inline-block rounded bg-amber-50/70 px-1 py-1 text-lg font-bold text-gray-800">
            {post.title}
          </h2>

          <div className="relative">
            <p className="mb-4 px-1 text-sm leading-[18px] font-medium text-gray-700">
              {post.content.split(' ').length > 30
                ? post.content.split(' ').slice(0, 30).join(' ') + '...'
                : post.content}
            </p>

            {/* 접착 테이프 효과 */}
            <div className="absolute -top-2 left-1/2 h-2 w-16 -translate-x-1/2 transform rounded-full bg-amber-100/70"></div>
          </div>
        </div>
      </article>
    </Link>
  );
}
