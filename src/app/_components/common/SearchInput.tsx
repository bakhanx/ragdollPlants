"use client"

import { useState, useEffect, useRef } from 'react';
import { SearchIcon } from '../icons';

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  debounceTime?: number;
  onSearch?: (query: string) => void; // 검색 콜백 함수
}

export const SearchInput = ({
  placeholder = '검색하기',
  defaultValue = '',
  debounceTime = 300,
  onSearch
}: SearchInputProps) => {
  const [searchQuery, setSearchQuery] = useState(defaultValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSearchQuery(defaultValue);
  }, [defaultValue]);

  // 사용자 입력 핸들러
  const handleInputChange = (value: string) => {
    setSearchQuery(value);

    // 이전 타이머 클리어
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 디바운스 타이머 설정
    timeoutRef.current = setTimeout(() => {
      onSearch?.(value);
    }, debounceTime);
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative flex items-center text-gray-50 w-3/4">
      <input
        type="text"
        value={searchQuery}
        onChange={e => handleInputChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 bg-black/10 text-white placeholder-gray-300 p-2 pl-9 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
      />
      <div className="absolute top-1/2 left-2 -translate-y-1/2 transform">
        <SearchIcon
          size={20}
          className="[&_path]:stroke-gray-50"
        />
      </div>
      {searchQuery && (
        <button
          onClick={() => handleInputChange('')}
          className="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-xl text-gray-200 hover:text-green-600">
          ×
        </button>
      )}
    </div>
  );
};