'use client';

import Link from 'next/link';
import { HomeIcon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function AdminHeader() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* 브레드크럼 */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">
            관리자 대시보드
          </h1>
        </div>

        {/* 우측 메뉴 */}
        <div className="flex items-center space-x-4">
          {/* 메인 사이트로 이동 */}
          <Link
            href="/"
            className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <HomeIcon className="h-4 w-4" />
            <span>메인 사이트</span>
          </Link>

          {/* 알림 */}
          <button className="relative p-2 text-gray-400 hover:text-gray-500">
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
          </button>

          {/* 프로필 */}
          <div className="flex items-center space-x-2">
            <UserCircleIcon className="h-8 w-8 text-gray-400" />
            <span className="text-sm font-medium text-gray-900">관리자</span>
          </div>
        </div>
      </div>
    </header>
  );
}
