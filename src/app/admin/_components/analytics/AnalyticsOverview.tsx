import { prisma } from '@/lib/prisma';
import {
  UsersIcon,
  DocumentTextIcon,
  PhotoIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

async function getAnalyticsOverview() {
  try {
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // 현재 통계
    const [
      totalUsers,
      activeUsers,
      totalContent,
      totalViews,
      totalLikes,
      newUsersThisWeek,
      newUsersLastWeek,
      newContentThisWeek,
      newContentLastWeek
    ] = await Promise.all([
      // 전체 사용자
      prisma.user.count(),
      // 활성 사용자 (지난 30일 활동)
      prisma.user.count({
        where: {
          lastActivityDate: {
            gte: lastMonth
          }
        }
      }),
      // 전체 콘텐츠 (각각 카운트하여 합산)
      Promise.all([
        prisma.article.count({ where: { isActive: true } }),
        prisma.diary.count({ where: { isActive: true } }),
        prisma.gallery.count({ where: { isActive: true } }),
        prisma.plant.count({ where: { isActive: true } })
      ]).then(counts => counts.reduce((sum, count) => sum + count, 0)),
      // 총 조회수
      prisma.article.aggregate({
        _sum: { viewCount: true }
      }).then(result => result._sum.viewCount || 0),
      // 총 좋아요
      prisma.like.count(),
      // 이번 주 신규 사용자
      prisma.user.count({
        where: {
          createdAt: { gte: lastWeek }
        }
      }),
      // 지난 주 신규 사용자
      prisma.user.count({
        where: {
          createdAt: { 
            gte: new Date(lastWeek.getTime() - 7 * 24 * 60 * 60 * 1000),
            lt: lastWeek
          }
        }
      }),
      // 이번 주 신규 콘텐츠
      prisma.article.count({
        where: {
          createdAt: { gte: lastWeek }
        }
      }),
      // 지난 주 신규 콘텐츠
      prisma.article.count({
        where: {
          createdAt: { 
            gte: new Date(lastWeek.getTime() - 7 * 24 * 60 * 60 * 1000),
            lt: lastWeek
          }
        }
      })
    ]);

    // 성장률 계산
    const userGrowthRate = newUsersLastWeek === 0 ? 0 : 
      ((newUsersThisWeek - newUsersLastWeek) / newUsersLastWeek) * 100;
    
    const contentGrowthRate = newContentLastWeek === 0 ? 0 : 
      ((newContentThisWeek - newContentLastWeek) / newContentLastWeek) * 100;

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        newThisWeek: newUsersThisWeek,
        growthRate: userGrowthRate
      },
      content: {
        total: totalContent,
        newThisWeek: newContentThisWeek,
        growthRate: contentGrowthRate
      },
      engagement: {
        views: totalViews,
        likes: totalLikes
      }
    };
  } catch (error) {
    console.error('분석 개요 조회 실패:', error);
    return {
      users: { total: 0, active: 0, newThisWeek: 0, growthRate: 0 },
      content: { total: 0, newThisWeek: 0, growthRate: 0 },
      engagement: { views: 0, likes: 0 }
    };
  }
}

export default async function AnalyticsOverview() {
  const data = await getAnalyticsOverview();

  const statCards = [
    {
      name: '총 사용자',
      value: data.users.total,
      change: data.users.newThisWeek,
      changeLabel: '이번 주 신규',
      growth: data.users.growthRate,
      icon: UsersIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: '활성 사용자',
      value: data.users.active,
      change: Math.round((data.users.active / data.users.total) * 100),
      changeLabel: '활성율',
      growth: 0,
      icon: UsersIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: '총 콘텐츠',
      value: data.content.total,
      change: data.content.newThisWeek,
      changeLabel: '이번 주 신규',
      growth: data.content.growthRate,
      icon: DocumentTextIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      name: '총 조회수',
      value: data.engagement.views,
      change: data.engagement.likes,
      changeLabel: '좋아요',
      growth: 0,
      icon: EyeIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <div key={stat.name} className={`${stat.bgColor} overflow-hidden rounded-lg px-4 py-5 shadow`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {stat.name}
                </dt>
                <dd>
                  <div className={`text-2xl font-semibold ${stat.color}`}>
                    {stat.value.toLocaleString()}
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="text-sm font-medium text-gray-500 mr-2">
                      {stat.change.toLocaleString()} {stat.changeLabel}
                    </div>
                    {stat.growth !== 0 && (
                      <div className={`flex items-center text-sm font-medium ${
                        stat.growth > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.growth > 0 ? (
                          <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                        )}
                        {Math.abs(stat.growth).toFixed(1)}%
                      </div>
                    )}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
