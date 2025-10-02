import { prisma } from '@/lib/prisma';
import { 
  ExclamationTriangleIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon 
} from '@heroicons/react/24/outline';

async function getReportStats() {
  try {
    const [
      totalReports,
      pendingReports,
      resolvedReports,
      rejectedReports,
      todayReports
    ] = await Promise.all([
      prisma.report.count(),
      prisma.report.count({ where: { status: 'PENDING' } }),
      prisma.report.count({ where: { status: 'RESOLVED' } }),
      prisma.report.count({ where: { status: 'REJECTED' } }),
      prisma.report.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      })
    ]);

    // 콘텐츠 타입별 통계
    const reportsByType = await prisma.report.groupBy({
      by: ['contentType'],
      _count: {
        contentType: true
      }
    });

    return {
      total: totalReports,
      pending: pendingReports,
      resolved: resolvedReports,
      rejected: rejectedReports,
      today: todayReports,
      byType: reportsByType
    };
  } catch (error) {
    console.error('신고 통계 조회 실패:', error);
    return {
      total: 0,
      pending: 0,
      resolved: 0,
      rejected: 0,
      today: 0,
      byType: []
    };
  }
}

export default async function ReportStats() {
  const stats = await getReportStats();

  const statCards = [
    {
      name: '대기 중',
      value: stats.pending,
      change: `${stats.today}`,
      changeLabel: '오늘 신고',
      icon: ClockIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      name: '처리 완료',
      value: stats.resolved,
      change: `${((stats.resolved / stats.total) * 100 || 0).toFixed(1)}%`,
      changeLabel: '처리율',
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: '거부됨',
      value: stats.rejected,
      change: `${((stats.rejected / stats.total) * 100 || 0).toFixed(1)}%`,
      changeLabel: '거부율',
      icon: XCircleIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      name: '전체 신고',
      value: stats.total,
      change: `${stats.pending}`,
      changeLabel: '대기',
      icon: ExclamationTriangleIcon,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
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
                <dd className="flex items-baseline">
                  <div className={`text-2xl font-semibold ${stat.color}`}>
                    {stat.value.toLocaleString()}
                  </div>
                  <div className="ml-2 flex items-baseline text-sm font-semibold text-gray-500">
                    {stat.change} {stat.changeLabel}
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
