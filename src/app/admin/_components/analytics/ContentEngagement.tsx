import { prisma } from '@/lib/prisma';

async function getContentEngagement() {
  try {
    const [
      articlesWithViews,
      totalLikes,
      totalComments,
      activeUsers
    ] = await Promise.all([
      prisma.article.findMany({
        where: { isActive: true, isPublished: true },
        select: { viewCount: true }
      }),
      prisma.like.count(),
      prisma.comment.count(),
      prisma.user.count({ where: { isActive: true } })
    ]);

    const totalViews = articlesWithViews.reduce((sum, article) => sum + article.viewCount, 0);
    const averageViews = articlesWithViews.length > 0 ? totalViews / articlesWithViews.length : 0;

    return {
      totalViews,
      totalLikes,
      totalComments,
      activeUsers,
      averageViews: Math.round(averageViews),
      engagementRate: activeUsers > 0 ? ((totalLikes + totalComments) / activeUsers * 100) : 0
    };
  } catch (error) {
    console.error('콘텐츠 참여도 조회 실패:', error);
    return {
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      activeUsers: 0,
      averageViews: 0,
      engagementRate: 0
    };
  }
}

export default async function ContentEngagement() {
  const engagement = await getContentEngagement();

  const engagementMetrics = [
    {
      name: '총 조회수',
      value: engagement.totalViews,
      change: `평균 ${engagement.averageViews}`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: '총 좋아요',
      value: engagement.totalLikes,
      change: `${engagement.activeUsers}명 중`,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      name: '총 댓글',
      value: engagement.totalComments,
      change: '활발한 토론',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: '참여율',
      value: `${engagement.engagementRate.toFixed(1)}%`,
      change: '활성 사용자 기준',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          콘텐츠 참여도 분석
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          {engagementMetrics.map((metric) => (
            <div key={metric.name} className={`${metric.bgColor} p-4 rounded-lg`}>
              <div className="flex flex-col">
                <div className="text-sm font-medium text-gray-500">
                  {metric.name}
                </div>
                <div className={`text-2xl font-semibold ${metric.color} mt-1`}>
                  {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {metric.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 참여도 인사이트 */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">참여도 인사이트</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">사용자당 평균 좋아요</span>
              <span className="font-medium">
                {engagement.activeUsers > 0 ? (engagement.totalLikes / engagement.activeUsers).toFixed(1) : '0'}개
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">아티클당 평균 조회수</span>
              <span className="font-medium">{engagement.averageViews.toLocaleString()}회</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">좋아요/조회수 비율</span>
              <span className="font-medium">
                {engagement.totalViews > 0 ? ((engagement.totalLikes / engagement.totalViews) * 100).toFixed(2) : '0'}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
