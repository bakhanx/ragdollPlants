import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { formatRelativeTime } from '@/app/_utils/dateUtils';

async function getTopPerformers() {
  try {
    // 인기 아티클 (조회수 기준)
    const topArticles = await prisma.article.findMany({
      take: 5,
      where: { isActive: true, isPublished: true },
      orderBy: { viewCount: 'desc' },
      select: {
        id: true,
        title: true,
        viewCount: true,
        createdAt: true,
        author: {
          select: { name: true }
        }
      }
    });

    // 활발한 사용자 (콘텐츠 생성량 기준)
    const activeUsers = await prisma.user.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            articles: true,
            diaries: true,
            galleries: true,
            plants: true
          }
        }
      }
    });

    // 총 콘텐츠 수로 정렬
    const sortedUsers = activeUsers
      .map(user => ({
        ...user,
        totalContent: user._count.articles + user._count.diaries + user._count.galleries + user._count.plants
      }))
      .sort((a, b) => b.totalContent - a.totalContent);

    // 최근 인기 다이어리 (좋아요 기준 - 임시로 생성 날짜 기준으로 대체)
    const popularDiaries = await prisma.diary.findMany({
      take: 3,
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        author: {
          select: { name: true }
        }
      }
    });

    return {
      topArticles,
      activeUsers: sortedUsers,
      popularDiaries
    };
  } catch (error) {
    console.error('인기 콘텐츠 조회 실패:', error);
    return {
      topArticles: [],
      activeUsers: [],
      popularDiaries: []
    };
  }
}

export default async function TopPerformers() {
  const { topArticles, activeUsers, popularDiaries } = await getTopPerformers();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 인기 아티클 */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              인기 아티클
            </h3>
            <Link 
              href="/admin/content/articles" 
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              전체 보기
            </Link>
          </div>

          <div className="space-y-3">
            {topArticles.length === 0 ? (
              <p className="text-sm text-gray-500">아티클이 없습니다.</p>
            ) : (
              topArticles.map((article, index) => (
                <div key={article.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-800">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/articles/${article.id}`}
                      className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
                    >
                      {article.title}
                    </Link>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">
                        {article.author.name}
                      </span>
                      <span className="text-xs font-medium text-gray-900">
                        {article.viewCount.toLocaleString()} 조회
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 활발한 사용자 */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              활발한 사용자
            </h3>
            <Link 
              href="/admin/users" 
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              전체 보기
            </Link>
          </div>

          <div className="space-y-3">
            {activeUsers.length === 0 ? (
              <p className="text-sm text-gray-500">사용자가 없습니다.</p>
            ) : (
              activeUsers.map((user, index) => (
                <div key={user.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-green-800">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-sm font-medium text-gray-900 hover:text-blue-600"
                    >
                      {user.name}
                    </Link>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">
                        {formatRelativeTime(user.createdAt)}
                      </span>
                      <span className="text-xs font-medium text-gray-900">
                        {user.totalContent}개 콘텐츠
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 최근 인기 다이어리 */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              최근 다이어리
            </h3>
            <Link 
              href="/admin/content/diaries" 
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              전체 보기
            </Link>
          </div>

          <div className="space-y-3">
            {popularDiaries.length === 0 ? (
              <p className="text-sm text-gray-500">다이어리가 없습니다.</p>
            ) : (
              popularDiaries.map((diary, index) => (
                <div key={diary.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-purple-800">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/diaries/${diary.id}`}
                      className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
                    >
                      {diary.title}
                    </Link>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">
                        {diary.author.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatRelativeTime(diary.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
