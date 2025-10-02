import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { 
  DocumentTextIcon, 
  BookOpenIcon, 
  PhotoIcon, 
  CubeIcon,
  EyeIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

async function getContentStats() {
  try {
    const [
      totalArticles,
      publishedArticles,
      totalDiaries,
      activeDiaries,
      totalGalleries,
      activeGalleries,
      totalPlants,
      activePlants,
      totalViews,
      totalLikes
    ] = await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { isPublished: true, isActive: true } }),
      prisma.diary.count(),
      prisma.diary.count({ where: { isActive: true } }),
      prisma.gallery.count(),
      prisma.gallery.count({ where: { isActive: true } }),
      prisma.plant.count(),
      prisma.plant.count({ where: { isActive: true } }),
      prisma.article.aggregate({
        _sum: { viewCount: true }
      }).then(result => result._sum.viewCount || 0),
      prisma.like.count()
    ]);

    return {
      articles: { total: totalArticles, published: publishedArticles },
      diaries: { total: totalDiaries, active: activeDiaries },
      galleries: { total: totalGalleries, active: activeGalleries },
      plants: { total: totalPlants, active: activePlants },
      engagement: { views: totalViews, likes: totalLikes }
    };
  } catch (error) {
    console.error('콘텐츠 통계 조회 실패:', error);
    return {
      articles: { total: 0, published: 0 },
      diaries: { total: 0, active: 0 },
      galleries: { total: 0, active: 0 },
      plants: { total: 0, active: 0 },
      engagement: { views: 0, likes: 0 }
    };
  }
}

export default async function ContentStats() {
  const stats = await getContentStats();

  const statCards = [
    {
      name: '아티클',
      total: stats.articles.total,
      active: stats.articles.published,
      label: '게시됨',
      icon: DocumentTextIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: '/admin/content/articles'
    },
    {
      name: '다이어리',
      total: stats.diaries.total,
      active: stats.diaries.active,
      label: '활성',
      icon: BookOpenIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '/admin/content/diaries'
    },
    {
      name: '갤러리',
      total: stats.galleries.total,
      active: stats.galleries.active,
      label: '활성',
      icon: PhotoIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      href: '/admin/content/galleries'
    },
    {
      name: '식물',
      total: stats.plants.total,
      active: stats.plants.active,
      label: '활성',
      icon: CubeIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      href: '/admin/content/plants'
    },
    {
      name: '총 조회수',
      total: stats.engagement.views,
      active: stats.engagement.likes,
      label: '좋아요',
      icon: EyeIcon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      href: '/admin/analytics/content'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {statCards.map((stat) => (
        <Link
          key={stat.name}
          href={stat.href}
          className={`${stat.bgColor} overflow-hidden rounded-lg px-4 py-5 shadow hover:shadow-md transition-shadow cursor-pointer`}
        >
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
                    {stat.total.toLocaleString()}
                  </div>
                  <div className="ml-2 flex items-baseline text-sm font-semibold text-gray-500">
                    {stat.active.toLocaleString()} {stat.label}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
