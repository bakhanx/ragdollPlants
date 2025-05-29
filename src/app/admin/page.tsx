import { requireAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

export default async function AdminPage() {
  // 관리자만 접근 가능
  const session = await requireAdmin();

  // 관리자용 대시보드 데이터
  const stats = await prisma.$transaction([
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.article.count(),
    prisma.plant.count(),
    prisma.comment.count()
  ]);

  const [userCount, articleCount, plantCount, commentCount] = stats;

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">관리자 대시보드</h1>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-600">총 사용자</h3>
          <p className="text-3xl font-bold text-blue-600">{userCount}</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-600">총 아티클</h3>
          <p className="text-3xl font-bold text-green-600">{articleCount}</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-600">총 식물</h3>
          <p className="text-3xl font-bold text-emerald-600">{plantCount}</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-600">총 댓글</h3>
          <p className="text-3xl font-bold text-purple-600">{commentCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">빠른 액션</h2>
          <div className="space-y-3">
            <a
              href="/admin/articles"
              className="block rounded bg-blue-50 p-3 hover:bg-blue-100">
              📝 아티클 관리
            </a>
            <a
              href="/admin/users"
              className="block rounded bg-green-50 p-3 hover:bg-green-100">
              👥 사용자 관리
            </a>
            <a
              href="/admin/reports"
              className="block rounded bg-red-50 p-3 hover:bg-red-100">
              🚨 신고 관리
            </a>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">관리자 정보</h2>
          <div className="space-y-2">
            <p>
              <strong>이름:</strong> {session.user.name}
            </p>
            <p>
              <strong>이메일:</strong> {session.user.email}
            </p>
            <p>
              <strong>역할:</strong> {session.user.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
