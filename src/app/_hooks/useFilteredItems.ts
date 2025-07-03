'use client';

import { useState, useCallback, useEffect } from 'react';
import { PAGINATION } from '../_constants/pagination';

export interface UseFilteredItemsOptions<T> {
  items: T[];
  filterFn: (item: T, query: string) => boolean;
  initialItemsCount?: number;
  loadMoreCount?: number;
}

export interface UseFilteredItemsResult<T> {
  filteredItems: T[];
  visibleItems: T[];
  hasMore: boolean;
  searchQuery: string;
  handleSearch: (query: string) => void;
  handleLoadMore: () => void;
  resetVisibleCount: () => void;
}

export function useFilteredItems<T>({
  items,
  filterFn,
  initialItemsCount = PAGINATION.ITEMS_PER_PAGE,
  loadMoreCount = PAGINATION.ITEMS_PER_PAGE
}: UseFilteredItemsOptions<T>): UseFilteredItemsResult<T> {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<T[]>(items);
  const [visibleCount, setVisibleCount] = useState(initialItemsCount);

  // items prop이 변경될 경우 필터링된 목록만 업데이트(visibleCount는 유지)
  useEffect(() => {
    if (!searchQuery) {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item => filterFn(item, searchQuery));
      setFilteredItems(filtered);
    }
    // visibleCount는 유지
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, searchQuery]);

  // 검색 처리 함수 (검색 시에만 visibleCount 리셋)
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setVisibleCount(initialItemsCount);
    },
    [initialItemsCount]
  );

  // 리셋 함수
  const resetVisibleCount = useCallback(() => {
    setVisibleCount(initialItemsCount);
  }, [initialItemsCount]);

  // 더보기 버튼 클릭 핸들러
  const handleLoadMore = useCallback(() => {
    setVisibleCount(prev =>
      Math.min(prev + loadMoreCount, filteredItems.length)
    );
  }, [loadMoreCount, filteredItems.length]);

  // 화면에 표시할 아이템들
  const visibleItems = filteredItems.slice(0, visibleCount);

  // 더보기 버튼 표시 여부
  const hasMore = visibleCount < filteredItems.length;

  return {
    filteredItems,
    visibleItems,
    hasMore,
    searchQuery,
    handleSearch,
    handleLoadMore,
    resetVisibleCount
  };
}
