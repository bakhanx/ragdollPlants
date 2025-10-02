import { prisma } from '@/lib/prisma';
import { formatRelativeTime } from '@/app/_utils/dateUtils';
import Link from 'next/link';

async function getContentOverview() {
  try {
    // 최근 아티클
    const recentArticles = await prisma.article.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        isPublished: true,
        viewCount: true,
        author: {
          select: {
            name: true
          }
        },
        category: {
          select: {
            name: true
          }
        }
      }
    });

    // 최근 다이어리
    const recentDiaries = await prisma.diary.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        isActive: true,
        author: {
          select: {
            name: true
          }
        }
      }
    });

    // 인기 콘텐츠 (조회수 기준)
    const popularArticles = await prisma.article.findMany({
      take: 5,
      orderBy: { viewCount: 'desc' },
      where: { isPublished: true, isActive: true },
      select: {
        id: true,
        title: true,
        viewCount: true,
        createdAt: true,
        author: {
          select: {
            name: true
          }
        }
      }
    });

    return {
      recentArticles,
      recentDiaries,
      popularArticles
    };
  } catch (error) {
    console.error('콘텐츠 개요 조회 실패:', error);
    return {
      recentArticles: [],
      recentDiaries: [],
      popularArticles: []
    };
  }
}

export default async function ContentOverview() {
  const { recentArticles, recentDiaries, popularArticles } = await getContentOverview();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 최근 아티클 */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              최근 아티클
            </h3>
            <Link 
              href="/admin/content/articles"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              전체 보기
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentArticles.length === 0 ? (
              <p className="text-sm text-gray-500">최근 아티클이 없습니다.</p>
            ) : (
              recentArticles.map((article) => (
                <div key={article.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/articles/${article.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
                      >
                        {article.title}
                      </Link>
                      <div className="mt-1 flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {article.author.name}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {article.category.name}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400">
                          {formatRelativeTime(article.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex items-center space-x-2">
                      {!article.isPublished && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          비공개
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        {article.viewCount} 조회
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 최근 다이어리 */}
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
            {recentDiaries.length === 0 ? (
              <p className="text-sm text-gray-500">최근 다이어리가 없습니다.</p>
            ) : (
              recentDiaries.map((diary) => (
                <div key={diary.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/diaries/${diary.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
                      >
                        {diary.title}
                      </Link>
                      <div className="mt-1 flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {diary.author.name}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400">
                          {formatRelativeTime(diary.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      {!diary.isActive && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          비활성
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 인기 콘텐츠 */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              인기 아티클
            </h3>
            <Link 
              href="/admin/analytics/content"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              분석 보기
            </Link>
          </div>
          
          <div className="space-y-3">
            {popularArticles.length === 0 ? (
              <p className="text-sm text-gray-500">인기 콘텐츠가 없습니다.</p>
            ) : (
              popularArticles.map((article, index) => (
                <div key={article.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
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
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {article.author.name}
                        </span>
                        <span className="text-xs font-medium text-gray-900">
                          {article.viewCount.toLocaleString()} 조회
                        </span>
                      </div>
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
