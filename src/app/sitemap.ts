import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.ragdollplants.site';

  // 기본 정적 페이지들
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/galleries`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/diaries`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ];

  try {
    // 동적 페이지들 - 기사
    const articles = await prisma.article.findMany({
      where: { isPublished: true },
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
      take: 1000, // 사이트맵 크기 제한
    });

    const articlePages = articles.map((article) => ({
      url: `${baseUrl}/articles/${article.id}`,
      lastModified: article.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    // 동적 페이지들 - 이벤트 (활성화된 것만)
    const events = await prisma.event.findMany({
      where: { isActive: true },
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
      take: 500,
    });

    const eventPages = events.map((event) => ({
      url: `${baseUrl}/events/${event.id}`,
      lastModified: event.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    // 동적 페이지들 - 갤러리 (공개+활성화된 것만)
    const galleries = await prisma.gallery.findMany({
      where: { 
        isPublic: true,
        isActive: true 
      },
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
      take: 1000,
    });

    const galleryPages = galleries.map((gallery) => ({
      url: `${baseUrl}/galleries/${gallery.id}`,
      lastModified: gallery.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }));

    return [...staticPages, ...articlePages, ...eventPages, ...galleryPages];
  } catch (error) {
    console.error('사이트맵 생성 중 오류:', error);
    // DB 연결 실패시 기본 정적 페이지들만 반환
    return staticPages;
  }
}
