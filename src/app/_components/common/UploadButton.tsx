'use client';

import Link from 'next/link';

interface UploadButtonProps {
  link: string;
  disabled?: boolean;
  count?: number;
  maxCount?: number;
  className?: string;
  title?: string;
}

export const UploadButton = ({
  link,
  disabled = false,
  count,
  maxCount,
  className = '',
  title = '등록'
}: UploadButtonProps) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {disabled ? (
        <button
          className="flex aspect-square w-10 cursor-not-allowed items-center justify-center rounded-md border-2 border-gray-300 bg-gray-500 text-xl text-white"
          disabled
          title={title + ' (최대 개수 도달)'}>
          <span className="text-2xl">+</span>
        </button>
      ) : (
        <Link
          href={link}
          className="flex aspect-square w-10 items-center justify-center rounded-md border-2 border-gray-300 text-xl text-white hover:bg-green-700"
          title={title}>
          <span className="text-2xl">+</span>
        </Link>
      )}
      {typeof count === 'number' && typeof maxCount === 'number' && (
        <span className="mt-1 text-xs text-gray-300">
          {count} / {maxCount}
        </span>
      )}
    </div>
  );
}
