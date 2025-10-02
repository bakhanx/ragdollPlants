import { prisma } from '@/lib/prisma';

async function getUserGrowthData() {
  try {
    const now = new Date();
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split('T')[0],
        displayDate: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
      };
    });

    const userGrowthPromises = last30Days.map(async ({ date }) => {
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setDate(endOfDay.getDate() + 1);

      const count = await prisma.user.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lt: endOfDay
          }
        }
      });

      return { date, count };
    });

    const dailyGrowth = await Promise.all(userGrowthPromises);
    
    return dailyGrowth.map(({ date, count }, index) => ({
      date: last30Days[index].displayDate,
      users: count
    }));
  } catch (error) {
    console.error('사용자 성장 데이터 조회 실패:', error);
    return [];
  }
}

export default async function UserGrowthChart() {
  const growthData = await getUserGrowthData();

  const maxUsers = Math.max(...growthData.map(d => d.users));
  const chartHeight = 200;

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          사용자 성장 추이 (최근 30일)
        </h3>
        
        <div className="relative">
          {/* 차트 영역 */}
          <div className="flex items-end justify-between h-48 border-l border-b border-gray-200">
            {growthData.map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                {/* 바 차트 */}
                <div className="w-full flex justify-center">
                  <div 
                    className="bg-blue-500 w-4 rounded-t"
                    style={{
                      height: maxUsers > 0 ? `${(data.users / maxUsers) * chartHeight}px` : '2px'
                    }}
                    title={`${data.date}: ${data.users}명`}
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* X축 레이블 (일부만 표시) */}
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            {growthData.map((data, index) => (
              <span key={index} className={index % 5 === 0 ? 'block' : 'opacity-0'}>
                {data.date}
              </span>
            ))}
          </div>
        </div>

        {/* 통계 요약 */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <div>
              <span className="text-gray-500">총 신규 가입: </span>
              <span className="font-medium">{growthData.reduce((sum, d) => sum + d.users, 0)}명</span>
            </div>
            <div>
              <span className="text-gray-500">일평균: </span>
              <span className="font-medium">
                {Math.round(growthData.reduce((sum, d) => sum + d.users, 0) / 30)}명
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
