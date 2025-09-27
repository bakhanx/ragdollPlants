import { Suspense } from 'react';
import SystemHealth from '../_components/system/SystemHealth';
import DatabaseManagement from '../_components/system/DatabaseManagement';
import BackupRestore from '../_components/system/BackupRestore';
import SystemSettings from '../_components/system/SystemSettings';
import RefreshButton from '../_components/common/RefreshButton';

export default function AdminSystemPage() {
  return (
    <div className="space-y-6">
      {/* 페이지 제목 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">시스템 관리</h1>
          <p className="mt-1 text-sm text-gray-600">
            시스템 상태를 모니터링하고 데이터베이스를 관리합니다.
          </p>
        </div>
        
        <div className="flex space-x-3">
          <RefreshButton />
        </div>
      </div>

      {/* 시스템 상태 */}
      <Suspense fallback={<div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>}>
        <SystemHealth />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 데이터베이스 관리 */}
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
          <DatabaseManagement />
        </Suspense>

        {/* 백업/복원 */}
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>}>
          <BackupRestore />
        </Suspense>
      </div>

      {/* 시스템 설정 */}
      <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>}>
        <SystemSettings />
      </Suspense>
    </div>
  );
}
