import Link from 'next/link';
import { 
  DocumentPlusIcon, 
  CalendarIcon,
  EyeIcon, 
  TrashIcon,
  PencilIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';

const quickActions = [
  {
    title: '콘텐츠 생성',
    actions: [
      {
        name: '새 아티클 작성',
        href: '/articles/upload',
        icon: DocumentPlusIcon,
        color: 'text-blue-600',
        description: '교육 콘텐츠 작성'
      },
      {
        name: '새 이벤트 생성',
        href: '/events/upload',
        icon: CalendarIcon,
        color: 'text-green-600',
        description: '커뮤니티 이벤트 생성'
      }
    ]
  },
  {
    title: '콘텐츠 관리',
    actions: [
      {
        name: '아티클 목록',
        href: '/admin/content/articles',
        icon: EyeIcon,
        color: 'text-purple-600',
        description: '모든 아티클 관리'
      },
      {
        name: '다이어리 관리',
        href: '/admin/content/diaries',
        icon: PencilIcon,
        color: 'text-yellow-600',
        description: '사용자 다이어리 관리'
      },
      {
        name: '갤러리 관리',
        href: '/admin/content/galleries',
        icon: ArchiveBoxIcon,
        color: 'text-indigo-600',
        description: '사진 갤러리 관리'
      }
    ]
  }
];

export default function QuickContentActions() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {quickActions.map((section) => (
        <div key={section.title} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              {section.title}
            </h3>
            
            <div className="space-y-3">
              {section.actions.map((action) => (
                <Link
                  key={action.name}
                  href={action.href}
                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group"
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center ${action.color} bg-gray-100 group-hover:bg-gray-200`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                      {action.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {action.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
