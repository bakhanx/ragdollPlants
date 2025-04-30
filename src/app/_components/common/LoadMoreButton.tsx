'use client';

import React from 'react';

interface LoadMoreButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export const LoadMoreButton = ({
  onClick,
  label = '더 보기',
  className = ''
}: LoadMoreButtonProps) => {
  return (
    <div className={`mt-6 flex justify-center ${className}`}>
      <button
        onClick={onClick}
        className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
      >
        {label}
      </button>
    </div>
  );
} 