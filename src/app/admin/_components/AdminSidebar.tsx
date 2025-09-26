'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  PhotoIcon, 
  BookOpenIcon, 
  CalendarIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  CogIcon,
  PresentationChartBarIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: '대시보드', href: '/admin', icon: HomeIcon },
  { 
    name: '사용자 관리', 
    href: '/admin/users', 
    icon: UsersIcon,
    children: [
      { name: '사용자 목록', href: '/admin/users' },
      { name: '권한 관리', href: '/admin/users/roles' },
      { name: '비활성 사용자', href: '/admin/users/inactive' }
    ]
  },
  { 
    name: '콘텐츠 관리', 
    href: '/admin/content', 
    icon: DocumentTextIcon,
    children: [
      { name: '아티클 관리', href: '/admin/content/articles' },
      { name: '다이어리 관리', href: '/admin/content/diaries' },
      { name: '갤러리 관리', href: '/admin/content/galleries' },
      { name: '식물 관리', href: '/admin/content/plants' }
    ]
  },
  { name: '이벤트 관리', href: '/admin/events', icon: CalendarIcon },
  { name: '신고 관리', href: '/admin/reports', icon: ExclamationTriangleIcon },
  { 
    name: '통계 분석', 
    href: '/admin/analytics', 
    icon: ChartBarIcon,
    children: [
      { name: '사용자 통계', href: '/admin/analytics/users' },
      { name: '콘텐츠 통계', href: '/admin/analytics/content' },
      { name: '활동 분석', href: '/admin/analytics/activity' }
    ]
  },
  { 
    name: '시스템 관리', 
    href: '/admin/system', 
    icon: CogIcon,
    children: [
      { name: '데이터베이스', href: '/admin/system/database' },
      { name: '백업/복원', href: '/admin/system/backup' },
      { name: '시스템 설정', href: '/admin/system/settings' }
    ]
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900">
      {/* 로고 */}
      <div className="flex h-16 shrink-0 items-center px-4">
        <Link href="/admin" className="text-white">
          <h1 className="text-lg font-semibold">RagdollPlants Admin</h1>
        </Link>
      </div>

      {/* 네비게이션 */}
      <nav className="flex flex-1 flex-col overflow-y-auto px-2 py-4">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  pathname === item.href
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5 shrink-0" aria-hidden="true" />
                {item.name}
              </Link>
              
              {/* 서브메뉴 */}
              {item.children && (
                <ul className="ml-8 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <li key={child.name}>
                      <Link
                        href={child.href}
                        className={`block px-2 py-1 text-sm rounded-md ${
                          pathname === child.href
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
