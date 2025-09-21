import { Suspense } from 'react';
import UserList from '../_components/users/UserList';
import UserStats from '../_components/users/UserStats';
import UserFilters from '../_components/users/UserFilters';

export default function AdminUsersPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="space-y-6">
      {/* 페이지 제목 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">사용자 관리</h1>
          <p className="mt-1 text-sm text-gray-600">
            플랫폼의 모든 사용자를 관리하고 모니터링합니다.
          </p>
        </div>
      </div>

      {/* 사용자 통계 */}
      <Suspense fallback={<div className="animate-pulse bg-gray-200 h-24 rounded-lg"></div>}>
        <UserStats />
      </Suspense>

      {/* 필터 및 검색 */}
      <UserFilters />

      {/* 사용자 목록 */}
      <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
        <UserList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
