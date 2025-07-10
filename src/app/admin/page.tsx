import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DataBackup from './_components/DataBackup';
import DatabaseReset from './_components/DatabaseReset';
import DataRestore from './_components/DataRestore';
import { ReportManagement } from './_components/ReportManagement';

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-blue-900">이벤트 관리</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    이벤트 생성, 수정, 삭제
                  </p>
                  <Link 
                    href="/events/upload" 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 inline-block"
                  >
                    이벤트 생성 →
                  </Link>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-medium text-green-900">아티클 관리</h3>
                  <p className="text-sm text-green-700 mt-1">
                    아티클 생성, 수정, 삭제
                  </p>
                  <Link 
                    href="/articles/upload" 
                    className="text-green-600 hover:text-green-800 text-sm font-medium mt-2 inline-block"
                  >
                    아티클 생성 →
                  </Link>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h3 className="font-medium text-purple-900">사용자 관리</h3>
                  <p className="text-sm text-purple-700 mt-1">
                    사용자 권한 및 계정 관리
                  </p>
                  <span className="text-purple-600 text-sm font-medium mt-2 inline-block">
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
