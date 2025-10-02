import { prisma } from '@/lib/prisma';
import { formatRelativeTime } from '@/app/_utils/dateUtils';
import Link from 'next/link';

async function getRecentActivity() {
  try {
    // 최근 사용자 가입
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        createdAt: true,
        isActive: true
      }
    });

    // 최근 아티클
    const recentArticles = await prisma.article.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        author: {
          select: {
            name: true
          }
        }
      }
    });

    // 최근 신고
    const recentReports = await prisma.report.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        reason: true,
        status: true,
        createdAt: true,
        contentType: true
      }
    });

    return {
      recentUsers,
      recentArticles,
      recentReports
    };
  } catch (error) {
    console.error('최근 활동 조회 실패:', error);
    return {
      recentUsers: [],
      recentArticles: [],
      recentReports: []
    };
  }
}

export default async function RecentActivity() {
  const { recentUsers, recentArticles, recentReports } = await getRecentActivity();

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          최근 활동
        </h3>

        <div className="space-y-6">
          {/* 최근 가입 사용자 */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">최근 가입 사용자</h4>
            <div className="space-y-2">
              {recentUsers.length === 0 ? (
                <p className="text-sm text-gray-500">최근 가입한 사용자가 없습니다.</p>
              ) : (
                recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 ${
                        user.isActive ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <Link 
                        href={`/admin/users/${user.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-blue-600"
                      >
                        {user.name}
                      </Link>
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatRelativeTime(user.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 최근 아티클 */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">최근 아티클</h4>
            <div className="space-y-2">
              {recentArticles.length === 0 ? (
                <p className="text-sm text-gray-500">최근 아티클이 없습니다.</p>
              ) : (
                recentArticles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between py-2">
                    <div>
                      <Link 
                        href={`/articles/${article.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-blue-600"
                      >
                        {article.title}
                      </Link>
                      <p className="text-xs text-gray-500">
                        작성자: {article.author.name}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatRelativeTime(article.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 최근 신고 */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">최근 신고</h4>
            <div className="space-y-2">
              {recentReports.length === 0 ? (
                <p className="text-sm text-gray-500">최근 신고가 없습니다.</p>
              ) : (
                recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 ${
                        report.status === 'PENDING' ? 'bg-yellow-500' :
                        report.status === 'RESOLVED' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <Link 
                          href={`/admin/reports/${report.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-blue-600"
                        >
                          {report.reason}
                        </Link>
                        <p className="text-xs text-gray-500">
                          {report.contentType} 콘텐츠 신고
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatRelativeTime(report.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 더 보기 링크 */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between">
            <Link 
              href="/admin/users" 
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              모든 사용자 보기 →
            </Link>
            <Link 
              href="/admin/reports" 
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              모든 신고 보기 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
