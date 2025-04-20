'use client';

import Link from 'next/link';
import { useAuth } from '@/app/_hooks/useAuth';

type FloatingButtonProps = {
  link: string;
  adminOnly?: boolean;
};

export default function FloatingButton({
  link,
  adminOnly = false
}: FloatingButtonProps) {
  const { isAdmin } = useAuth();

  // 관리자 전용 버튼인 경우 회색, 일반 버튼은 녹색 사용
  const bgColor = adminOnly
    ? 'bg-gray-500 hover:bg-gray-600'
    : 'bg-green-600 hover:bg-green-700';

  return (
    <div className="fixed right-1/2 bottom-18 z-50 translate-x-[calc(224px-2.5rem)] sm:right-auto">
      <button
        className={`flex size-16 items-center justify-center rounded-full ${bgColor} text-4xl text-white`}>
        <Link href={link}>+</Link>
      </button>
    </div>
  );
}
