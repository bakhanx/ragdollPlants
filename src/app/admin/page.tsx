import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth-utils';
import DataBackup from './_components/DataBackup';
import DatabaseReset from './_components/DatabaseReset';
import DataRestore from './_components/DataRestore';
import DataUpload from './_components/DataUpload';
import EventManagement from './_components/EventManagement';
import { ReportManagement } from './_components/ReportManagement';

export default async function AdminPage() {
  try {
    await requireAdmin();
  } catch {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">관리자 페이지</h1>

        <div className="space-y-6">
          {/* 신고 관리 섹션 */}
          <div className="rounded-lg bg-white shadow">
            <ReportManagement />
          </div>

          {/* 데이터 업로드 섹션 */}
          <DataUpload />

          {/* 이벤트 관리 섹션 */}
          <EventManagement />

          {/* 데이터 백업 섹션 */}
          <DataBackup />

          {/* 데이터베이스 리셋 섹션 */}
          <DatabaseReset />

          {/* 데이터 복원 섹션 */}
          <DataRestore />

          {/* 기존 시스템 관리 섹션 */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">시스템 관리</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <h3 className="font-medium text-blue-900">이벤트 관리</h3>
                  <p className="mt-1 text-sm text-blue-700">
                    이벤트 생성, 수정, 삭제
                  </p>
                  <Link
                    href="/events/upload"
                    className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-800">
                    이벤트 생성 →
                  </Link>
                </div>

                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <h3 className="font-medium text-green-900">아티클 관리</h3>
                  <p className="mt-1 text-sm text-green-700">
                    아티클 생성, 수정, 삭제
                  </p>
                  <Link
                    href="/articles/upload"
                    className="mt-2 inline-block text-sm font-medium text-green-600 hover:text-green-800">
                    아티클 생성 →
                  </Link>
                </div>

                <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                  <h3 className="font-medium text-purple-900">사용자 관리</h3>
                  <p className="mt-1 text-sm text-purple-700">
                    사용자 권한 및 계정 관리
                  </p>
                  <span className="mt-2 inline-block text-sm font-medium text-purple-600">
                    개발 예정
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
