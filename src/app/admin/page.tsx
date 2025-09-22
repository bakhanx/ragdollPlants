import { Suspense } from 'react';
import AdminStats from './_components/AdminStats';
import RecentActivity from './_components/RecentActivity';
import QuickActions from './_components/QuickActions';
import SystemStatus from './_components/SystemStatus';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* 페이지 제목 */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">대시보드</h1>
        <p className="mt-1 text-sm text-gray-600">
          RagdollPlants 관리자 대시보드에 오신 것을 환영합니다.
        </p>
      </div>

      {/* 통계 카드 */}
      <Suspense fallback={<div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>}>
        <AdminStats />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 빠른 작업 */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>

        {/* 최근 활동 */}
        <div className="lg:col-span-2">
          <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>}>
            <RecentActivity />
          </Suspense>
        </div>
      </div>

      {/* 시스템 상태 */}
      <Suspense fallback={<div className="animate-pulse bg-gray-200 h-40 rounded-lg"></div>}>
        <SystemStatus />
      </Suspense>
    </div>
  );
}
