'use client';

import { useState, useEffect } from 'react';
import { SearchInput } from './SearchInput';

interface FilterableListProps<T> {
  items: T[];
  renderList: (filteredItems: T[]) => React.ReactNode;
  filterFn: (item: T, query: string) => boolean;
  searchPlaceholder?: string;
  className?: string;
}

export const FilterableList = <T,>({
  items,
  renderList,
  filterFn,
  searchPlaceholder = '검색하기',
  className = ''
}: FilterableListProps<T>) => {
  const [filteredItems, setFilteredItems] = useState<T[]>(items);

  // items prop이 변경될 경우 필터링된 목록도 업데이트
  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredItems(items);
      return;
    }

    const filtered = items.filter(item => filterFn(item, query));
    setFilteredItems(filtered);
  };

  return (
    <div className={className}>
      <div>
        <SearchInput 
          onSearch={handleSearch} 
          placeholder={searchPlaceholder} 
        />
      </div>
      
      {renderList(filteredItems)}
      
      {filteredItems.length === 0 && (
        <div className="mt-4 text-center text-gray-500">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
} 