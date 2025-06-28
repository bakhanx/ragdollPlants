'use client';

import {
  ChevronLeftIcon,
  ChevronRightIcon
} from '@/app/_components/icons/Icons';
import { PAGINATION } from '@/app/_constants/pagination';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}: PaginationProps) => {
  // 페이지네이션 버튼 생성 로직
  const generatePageNumbers = () => {
    const maxVisible = PAGINATION.MAX_VISIBLE_PAGES_MOBILE; //
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisible) {
      // 총 페이지가 적으면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        // 앞쪽 페이지들
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // 뒤쪽 페이지들
        pages.push(
          1,
          '...',
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        // 중간 페이지들
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        );
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div
      className={`flex items-center justify-center space-x-2 pt-12 ${className}`}>
      {/* 이전 버튼 */}
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="이전 페이지">
        <ChevronLeftIcon
          size={16}
          className={
            currentPage === 1
              ? '[&_path]:stroke-gray-400'
              : '[&_path]:stroke-gray-600'
          }
        />
      </button>

      {/* 페이지 번호들 */}
      <div className="flex items-center space-x-1">
        {pageNumbers.map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="flex h-9 w-9 items-center justify-center text-gray-400">
                ...
              </span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
                  currentPage === page
                    ? 'border-green-600 bg-green-600 text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
                aria-label={`${page}페이지로 이동`}
                aria-current={currentPage === page ? 'page' : undefined}>
                {page}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 다음 버튼 */}
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="다음 페이지">
        <ChevronRightIcon
          size={16}
          className={
            currentPage === totalPages
              ? '[&_path]:stroke-gray-400'
              : '[&_path]:stroke-gray-600'
          }
        />
      </button>

      {/* 페이지 정보 (선택사항) */}
      {/* <div className="ml-4 text-sm text-gray-500">
        {currentPage} / {totalPages}
      </div> */}
    </div>
  );
};
