import Link from 'next/link';
import { 
  PlusIcon, 
  DocumentTextIcon, 
  CalendarIcon, 
  UsersIcon, 
  ExclamationTriangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const quickActions = [
  {
    name: '새 아티클 작성',
    href: '/articles/upload',
    icon: DocumentTextIcon,
    color: 'bg-green-600 hover:bg-green-700'
  },
  {
    name: '새 이벤트 생성',
    href: '/events/upload',
    icon: CalendarIcon,
    color: 'bg-blue-600 hover:bg-blue-700'
  },
  {
    name: '사용자 관리',
    href: '/admin/users',
    icon: UsersIcon,
    color: 'bg-purple-600 hover:bg-purple-700'
  },
  {
    name: '신고 관리',
    href: '/admin/reports',
    icon: ExclamationTriangleIcon,
    color: 'bg-red-600 hover:bg-red-700'
  },
  {
    name: '통계 보기',
    href: '/admin/analytics',
    icon: ChartBarIcon,
    color: 'bg-indigo-600 hover:bg-indigo-700'
  }
];

export default function QuickActions() {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          빠른 작업
        </h3>
        
        <div className="space-y-3">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className={`flex-shrink-0 w-8 h-8 ${action.color} rounded-md flex items-center justify-center`}>
                <action.icon className="h-4 w-4 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {action.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
