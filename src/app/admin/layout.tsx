import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth-utils';
import AdminSidebar from './_components/AdminSidebar';
import AdminHeader from './_components/AdminHeader';

export const metadata = {
  title: 'RagdollPlants 관리자',
  description: 'RagdollPlants 관리자 페이지'
};

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAdmin();
  } catch {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* 사이드바 */}
        <AdminSidebar />
        
        {/* 메인 콘텐츠 영역 */}
        <div className="flex-1">
          <AdminHeader />
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
