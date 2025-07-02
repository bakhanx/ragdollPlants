'use client';

import { useState, useCallback, useMemo } from 'react';
import { useFilteredItems } from './useFilteredItems';
import { PAGINATION } from '../_constants/pagination';

export interface UseTabItemsOptions<T, TabType extends string> {
  allItems: Record<TabType, T[]>;
  filterFn: (item: T, query: string) => boolean;
  initialTab: TabType;
  initialItemsCount?: number;
  loadMoreCount?: number;
}

export interface UseTabItemsResult<T, TabType extends string> {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  visibleItems: T[];
  hasMore: boolean;
  handleSearch: (query: string) => void;
  handleLoadMore: () => void;
  filteredItemsCount: Record<TabType, number>;
}

export function useTabItems<T, TabType extends string>({
  allItems,
  filterFn,
  initialTab,
  initialItemsCount = PAGINATION.ITEMS_PER_PAGE,
  loadMoreCount = PAGINATION.ITEMS_PER_PAGE
}: UseTabItemsOptions<T, TabType>): UseTabItemsResult<T, TabType> {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 현재 탭의 아이템
  const currentItems = allItems[activeTab];
  
  // 현재 활성 탭의 데이터에 대한 필터링 및 페이지네이션
  const {
    filteredItems: currentFilteredItems,
    visibleItems,
    hasMore,
    handleSearch: handleTabSearch,
    handleLoadMore
  } = useFilteredItems<T>({
    items: currentItems,
    filterFn,
    initialItemsCount,
    loadMoreCount
  });
  
  // 각 탭별 필터링된 아이템 개수 계산
  const filteredItemsCount = useMemo(() => {
    const result = {} as Record<TabType, number>;
    
    Object.keys(allItems).forEach((tabKey) => {
      const key = tabKey as TabType;
      const items = allItems[key];
      
      if (!searchQuery) {
        result[key] = items.length;
      } else {
        const filtered = items.filter(item => filterFn(item, searchQuery));
        result[key] = filtered.length;
      }
    });
    
    return result;
  }, [allItems, filterFn, searchQuery]);
  
  // 탭 변경 핸들러
  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);
  
  // 검색 처리 함수
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    handleTabSearch(query);
  }, [handleTabSearch]);
  
  return {
    activeTab,
    setActiveTab: handleTabChange,
    visibleItems,
    hasMore,
    handleSearch,
    handleLoadMore,
    filteredItemsCount
  };
} 