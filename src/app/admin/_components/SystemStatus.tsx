import { prisma } from '@/lib/prisma';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

async function getSystemStatus() {
  try {
    // 데이터베이스 연결 테스트
    await prisma.$queryRaw`SELECT 1`;
    
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    // 최근 24시간 활동
    const [
      recentUsers,
      recentContent,
      errorReports
    ] = await Promise.all([
      prisma.user.count({
        where: {
          createdAt: {
            gte: oneDayAgo
          }
        }
      }),
      prisma.article.count({
        where: {
          createdAt: {
            gte: oneDayAgo
          }
        }
      }),
      prisma.report.count({
        where: {
          status: 'PENDING'
        }
      })
    ]);

    return {
      database: {
        status: 'healthy',
        message: '데이터베이스 연결 정상'
      },
      activity: {
        status: 'healthy',
        message: `24시간 내 신규 사용자 ${recentUsers}명, 신규 콘텐츠 ${recentContent}개`
      },
      reports: {
        status: errorReports > 10 ? 'warning' : 'healthy',
        message: errorReports > 10 ? 
          `대기 중인 신고 ${errorReports}건` : 
          `처리 대기 신고 ${errorReports}건`
      }
    };
  } catch (error) {
    console.error('시스템 상태 확인 실패:', error);
    return {
      database: {
        status: 'error',
        message: '데이터베이스 연결 오류'
      },
      activity: {
        status: 'error',
        message: '활동 정보 조회 실패'
      },
      reports: {
        status: 'error',
        message: '신고 정보 조회 실패'
      }
    };
  }
}

export default async function SystemStatus() {
  const status = await getSystemStatus();

  const getStatusIcon = (statusType: string) => {
    switch (statusType) {
      case 'healthy':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <CheckCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (statusType: string) => {
    switch (statusType) {
      case 'healthy':
        return 'text-green-700';
      case 'warning':
        return 'text-yellow-700';
      case 'error':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          시스템 상태
        </h3>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center space-x-3">
            {getStatusIcon(status.database.status)}
            <div>
              <p className="text-sm font-medium text-gray-900">데이터베이스</p>
              <p className={`text-sm ${getStatusColor(status.database.status)}`}>
                {status.database.message}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {getStatusIcon(status.activity.status)}
            <div>
              <p className="text-sm font-medium text-gray-900">사용자 활동</p>
              <p className={`text-sm ${getStatusColor(status.activity.status)}`}>
                {status.activity.message}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {getStatusIcon(status.reports.status)}
            <div>
              <p className="text-sm font-medium text-gray-900">신고 관리</p>
              <p className={`text-sm ${getStatusColor(status.reports.status)}`}>
                {status.reports.message}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            마지막 업데이트: {new Date().toLocaleString('ko-KR')}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            새로고침
          </button>
        </div>
      </div>
    </div>
  );
}
