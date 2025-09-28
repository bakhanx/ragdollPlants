'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
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
  const [visibleCount, setVisibleCount] = useState(initialItemsCount);

  const filteredItems = useMemo(() => {
    if (!searchQuery) {
      return items;
    } else {
      return items.filter(item => filterFn(item, searchQuery));
    }
  }, [items, searchQuery, filterFn]);

  // 필터링된 아이템 개수
  const filteredItemsLength = useMemo(
    () => filteredItems.length,
    [filteredItems]
  );

  // 검색 처리
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
    setVisibleCount(prev => {
      return Math.min(prev + loadMoreCount, filteredItemsLength);
    });
  }, [loadMoreCount, filteredItemsLength]);

  // 화면에 표시할 아이템들과 더보기 버튼 표시 여부
  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  const hasMore = useMemo(() => {
    return visibleCount < filteredItemsLength;
  }, [visibleCount, filteredItemsLength]);

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
