'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition, useCallback } from 'react';
import { SearchInput } from './SearchInput';

interface SearchInputWithNavigationProps {
  placeholder?: string;
  defaultValue?: string;
  basePath: string;
}

export const SearchInputWithNavigation = ({
  placeholder,
  defaultValue,
  basePath
}: SearchInputWithNavigationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // 검색 핸들러 - URL 쿼리 파라미터 업데이트
  const handleSearch = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams);
      
      if (query.trim()) {
        params.set('search', query);
      } else {
        params.delete('search');
      }
      
      // 검색 시 첫 페이지로 이동
      params.delete('page');

      startTransition(() => {
        router.push(`${basePath}?${params.toString()}`);
      });
    },
    [searchParams, router, startTransition, basePath]
  );

  return (
    <SearchInput
      placeholder={placeholder}
      defaultValue={defaultValue}
      onSearch={handleSearch}
    />
  );
};