import { Suspense } from 'react';
import ReportStats from '../_components/reports/ReportStats';
import ReportList from '../_components/reports/ReportList';
import ReportFilters from '../_components/reports/ReportFilters';

export default async function AdminReportsPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  return (
    <div className="space-y-6">
      {/* 페이지 제목 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">신고 관리</h1>
          <p className="mt-1 text-sm text-gray-600">
            사용자 신고를 검토하고 적절한 조치를 취하세요.
          </p>
        </div>
      </div>

      {/* 신고 통계 */}
      <Suspense fallback={<div className="animate-pulse bg-gray-200 h-24 rounded-lg"></div>}>
        <ReportStats />
      </Suspense>

      {/* 필터 */}
      <ReportFilters />

      {/* 신고 목록 */}
      <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
        <ReportList searchParams={resolvedSearchParams} />
      </Suspense>
    </div>
  );
}
