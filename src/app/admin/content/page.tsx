import { Suspense } from 'react';
import Link from 'next/link';
import ContentStats from '../_components/content/ContentStats';
import ContentOverview from '../_components/content/ContentOverview';
import QuickContentActions from '../_components/content/QuickContentActions';

export default function AdminContentPage() {
  return (
    <div className="space-y-6">
      {/* 페이지 제목 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">콘텐츠 관리</h1>
          <p className="mt-1 text-sm text-gray-600">
            플랫폼의 모든 콘텐츠를 통합 관리합니다.
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Link
            href="/articles/upload"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            새 아티클
          </Link>
          <Link
            href="/events/upload"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            새 이벤트
          </Link>
        </div>
      </div>

      {/* 콘텐츠 통계 */}
      <Suspense fallback={<div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>}>
        <ContentStats />
      </Suspense>

      {/* 빠른 작업 */}
      <QuickContentActions />

      {/* 콘텐츠 개요 */}
      <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
        <ContentOverview />
      </Suspense>
    </div>
  );
}
