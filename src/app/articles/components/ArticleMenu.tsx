'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type DiaryMenuProps = {
  postId: string;
};

export default function DiaryMenu({ postId }: DiaryMenuProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="relative">
      <button
        onClick={handleMenuClick}
        className="group relative flex size-9 items-center justify-center rounded-xl bg-white/50 transition-all hover:bg-white/70 hover:shadow-md"
        aria-label="메뉴 열기">
        <svg
          className="h-5 w-5 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
          />
        </svg>
      </button>

      {showMenu && (
        <div className="absolute top-10 right-0 z-20 w-36 overflow-hidden rounded-lg bg-white shadow-lg">
          <ul>
            <li>
              <button
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                onClick={() => router.push(`/diary/edit/${postId}`)}>
                수정하기
              </button>
            </li>
            <li>
              <button className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100">
                삭제하기
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
} 