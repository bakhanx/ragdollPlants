import { prisma } from '@/lib/prisma';
import { 
  UsersIcon, 
  DocumentTextIcon, 
  PhotoIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

async function getAdminStats() {
  try {
    const [
      totalUsers,
      activeUsers,
      totalArticles,
      totalDiaries,
      totalGalleries,
      totalPlants,
      pendingReports
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.article.count({ where: { isActive: true } }),
      prisma.diary.count({ where: { isActive: true } }),
      prisma.gallery.count({ where: { isActive: true } }),
      prisma.plant.count({ where: { isActive: true } }),
      prisma.report.count({ where: { status: 'PENDING' } })
    ]);

    return {
      totalUsers,
      activeUsers,
      totalArticles,
      totalDiaries,
      totalGalleries,
      totalPlants,
      pendingReports,
      totalContent: totalArticles + totalDiaries + totalGalleries + totalPlants
    };
  } catch (error) {
    console.error('관리자 통계 조회 실패:', error);
    return {
      totalUsers: 0,
      activeUsers: 0,
      totalArticles: 0,
      totalDiaries: 0,
      totalGalleries: 0,
      totalPlants: 0,
      pendingReports: 0,
      totalContent: 0
    };
  }
}

export default async function AdminStats() {
  const stats = await getAdminStats();

  const statCards = [
    {
      name: '전체 사용자',
      value: stats.totalUsers.toLocaleString(),
      subValue: `활성: ${stats.activeUsers.toLocaleString()}`,
      icon: UsersIcon,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      name: '전체 콘텐츠',
      value: stats.totalContent.toLocaleString(),
      subValue: `아티클: ${stats.totalArticles}`,
      icon: DocumentTextIcon,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      name: '다이어리',
      value: stats.totalDiaries.toLocaleString(),
      subValue: '사용자 게시글',
      icon: PhotoIcon,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      name: '신고 대기',
      value: stats.pendingReports.toLocaleString(),
      subValue: '검토 필요',
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <div key={stat.name} className={`overflow-hidden rounded-lg ${stat.bgColor} px-4 py-5 shadow`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`rounded-md ${stat.color} p-3`}>
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {stat.name}
                </dt>
                <dd>
                  <div className={`text-lg font-medium ${stat.textColor}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">
                    {stat.subValue}
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
