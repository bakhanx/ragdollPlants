import { Suspense } from 'react';
import AnalyticsOverview from '../_components/analytics/AnalyticsOverview';
import UserGrowthChart from '../_components/analytics/UserGrowthChart';
import ContentEngagement from '../_components/analytics/ContentEngagement';
import TopPerformers from '../_components/analytics/TopPerformers';

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* 페이지 제목 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">통계 분석</h1>
          <p className="mt-1 text-sm text-gray-600">
            플랫폼의 성장과 사용자 활동을 분석합니다.
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            보고서 내보내기
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            새로고침
          </button>
        </div>
      </div>

      {/* 개요 통계 */}
      <Suspense fallback={<div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>}>
        <AnalyticsOverview />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 사용자 성장 차트 */}
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>}>
          <UserGrowthChart />
        </Suspense>

        {/* 콘텐츠 참여도 */}
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>}>
          <ContentEngagement />
        </Suspense>
      </div>

      {/* 인기 콘텐츠 */}
      <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
        <TopPerformers />
      </Suspense>
    </div>
  );
}
