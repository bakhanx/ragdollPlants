import { prisma } from '@/lib/prisma';
import { UsersIcon, UserGroupIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

async function getUserStats() {
  try {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      adminUsers,
      newUsersWeek,
      newUsersMonth
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: false } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({
        where: {
          createdAt: { gte: oneWeekAgo }
        }
      }),
      prisma.user.count({
        where: {
          createdAt: { gte: oneMonthAgo }
        }
      })
    ]);

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      adminUsers,
      newUsersWeek,
      newUsersMonth
    };
  } catch (error) {
    console.error('사용자 통계 조회 실패:', error);
    return {
      totalUsers: 0,
      activeUsers: 0,
      inactiveUsers: 0,
      adminUsers: 0,
      newUsersWeek: 0,
      newUsersMonth: 0
    };
  }
}

export default async function UserStats() {
  const stats = await getUserStats();

  const statCards = [
    {
      name: '전체 사용자',
      value: stats.totalUsers,
      change: `+${stats.newUsersMonth}`,
      changeLabel: '이번 달',
      icon: UsersIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: '활성 사용자',
      value: stats.activeUsers,
      change: `${((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%`,
      changeLabel: '활성율',
      icon: UserGroupIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: '신규 가입 (주간)',
      value: stats.newUsersWeek,
      change: `${stats.newUsersMonth}`,
      changeLabel: '월간',
      icon: UsersIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      name: '비활성 사용자',
      value: stats.inactiveUsers,
      change: `${stats.adminUsers}`,
      changeLabel: '관리자',
      icon: ExclamationTriangleIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
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
