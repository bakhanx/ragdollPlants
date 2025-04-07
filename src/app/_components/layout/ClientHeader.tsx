'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import DiaryMenu from '@/app/diary/_components/DiaryMenu';

interface ClientHeaderProps {
  title: string;
  postId?: string;
  showBackButton?: boolean;
}

export default function ClientHeader({ 
  title, 
  postId,
  showBackButton = false
}: ClientHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="w-full flex items-center justify-between py-3 px-2 fixed z-10 bg-white/1 shadow-lg backdrop-blur-sm rounded-t-2xl">
      <div className="w-12 flex-shrink-0">
        {showBackButton && (
          <button
            onClick={handleBack}
            className="group flex size-9 items-center justify-center rounded-xl bg-white/50 transition-all hover:bg-white/70 hover:shadow-md"
            aria-label="뒤로 가기">
            <svg
              className="h-5 w-5 text-gray-700 transition-transform group-hover:-translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="flex-1 text-center">
        <h1 className="text-lg font-bold text-gray-800 truncate">
          {title}
        </h1>
      </div>

      <div className="w-12 flex-shrink-0 flex justify-end">
        {postId && <DiaryMenu postId={postId} />}
      </div>
    </div>
  );
} 