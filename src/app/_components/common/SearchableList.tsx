'use client';

import { useState, useEffect, ReactNode } from 'react';
import { SearchInput } from './SearchInput';

interface SearchableListProps<T> {
  items: T[];
  renderList: (filteredItems: T[]) => ReactNode;
  filterFn: (item: T, query: string) => boolean;
  searchPlaceholder?: string;
  className?: string;
  renderActions?: ReactNode;
  searchContainerClassName?: string;
  initialItemsToShow?: number;
  itemsToLoadMore?: number;
  emptyResultMessage?: string;
  loadMoreButtonLabel?: string;
}

export const SearchableList = <T,>({
  items,
  renderList,
  filterFn,
  searchPlaceholder = '검색하기',
  className = '',
  renderActions,
  searchContainerClassName = 'max-w-xs',
  initialItemsToShow = 5,
  itemsToLoadMore = 5,
  emptyResultMessage = '검색 결과가 없습니다.',
  loadMoreButtonLabel = '더보기'
}: SearchableListProps<T>) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<T[]>(items);
  const [visibleItemsCount, setVisibleItemsCount] = useState(initialItemsToShow);
  
  // 화면에 표시되는 항목들 (필터링된 항목 중 visibleItemsCount만큼만)
  const visibleItems = filteredItems.slice(0, visibleItemsCount);
  
  // 더 보여줄 항목이 있는지 여부
  const hasMoreItems = visibleItemsCount < filteredItems.length;

  // items prop이 변경될 경우 필터링된 목록도 업데이트
  useEffect(() => {
    handleSearch(searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // 검색 처리 함수
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query) {
      // 검색어가 없으면 모든 항목 표시
      setFilteredItems(items);
    } else {
      // 검색어가 있으면 필터링
      const filtered = items.filter(item => filterFn(item, query));
      setFilteredItems(filtered);
    }
    
    // 검색 시 항상 처음부터 보여주기
    setVisibleItemsCount(initialItemsToShow);
  };

  // 더보기 버튼 클릭 시 처리
  const handleLoadMore = () => {
    setVisibleItemsCount(prev => Math.min(prev + itemsToLoadMore, filteredItems.length));
  };

  // 검색 결과가 없는 경우 메시지 렌더링
  const renderEmptyResult = () => (
    <div className="mt-4 text-center text-gray-500">
      {emptyResultMessage}
    </div>
  );

  // 더보기 버튼 렌더링
  const renderLoadMoreButton = () => (
    <div className="mt-6 flex justify-center">
      <button
        onClick={handleLoadMore}
        className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
      >
        {loadMoreButtonLabel}
      </button>
    </div>
  );

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between w-full">
        <div className={searchContainerClassName}>
          <SearchInput 
            onSearch={handleSearch} 
            placeholder={searchPlaceholder} 
          />
        </div>
        {renderActions && (
          <div className="ml-4">
            {renderActions}
          </div>
        )}
      </div>
      
      <div className="mt-4">
        {/* 현재 보이는 항목 렌더링 */}
        {visibleItems.length > 0 ? renderList(visibleItems) : renderEmptyResult()}
        
        {/* 더보기 버튼 */}
        {hasMoreItems && renderLoadMoreButton()}
      </div>
    </div>
  );
} 