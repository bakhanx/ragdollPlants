import { useState, useEffect, useCallback } from 'react';
import { SearchIcon } from '../icons';

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  debounceTime?: number;
}

export default function SearchInput({
  onSearch,
  placeholder = '검색하기',
  className = '',
  defaultValue = '',
  debounceTime = 300,
}: SearchInputProps) {
  const [searchQuery, setSearchQuery] = useState(defaultValue);

  // 디바운스 처리를 통해 검색 성능 최적화
  const debouncedSearch = useCallback(
    (value: string) => {
      const timer = setTimeout(() => {
        onSearch(value);
      }, debounceTime);

      return () => {
        clearTimeout(timer);
      };
    },
    [onSearch, debounceTime]
  );

  useEffect(() => {
    const cleanup = debouncedSearch(searchQuery);
    return cleanup;
  }, [searchQuery, debouncedSearch]);

  return (
    <div className={`relative flex items-center ${className}`}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border-2 border-gray-50 p-2 pl-9 text-sm text-gray-700 focus:border-green-500 focus:outline-none"
      />
      <div className="absolute left-2 top-1/2 -translate-y-1/2 transform">
        <SearchIcon size={18} className="text-gray-400" />
      </div>
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full p-1 text-gray-400 hover:bg-gray-100"
        >
          ×
        </button>
      )}
    </div>
  );
} 