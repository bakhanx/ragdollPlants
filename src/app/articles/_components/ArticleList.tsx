'use client';

import { useTabItems } from '@/app/_hooks/useTabItems';
import { TabNavigation } from '@/app/_components/common/TabNavigation';
import { LoadMoreButton } from '@/app/_components/common/LoadMoreButton';
import { ArticleItem } from './ArticleItem';
import { ArticleWithNumberId, ArticleTabType } from '@/types/models/article';

export default function ArticleList({
  allArticles,
  tipsArticles,
  newsArticles,
  guideArticles,
  isAdmin
}: {
  allArticles: ArticleWithNumberId[];
  tipsArticles: ArticleWithNumberId[];
  newsArticles: ArticleWithNumberId[];
  guideArticles: ArticleWithNumberId[];
  isAdmin: boolean;
}) {
  // 서버에서 미리 처리된 참조값을 그대로 사용
  const allItems = {
    all: allArticles,
    tips: tipsArticles,
    news: newsArticles,
    guide: guideArticles
  };

  // 탭/검색/더보기 등 상태 관리
  const {
    activeTab,
    setActiveTab,
    visibleItems,
    hasMore,
    handleSearch,
    handleLoadMore,
    filteredItemsCount
  } = useTabItems<ArticleWithNumberId, ArticleTabType>({
    allItems,
    filterFn: (item, query) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.content.toLowerCase().includes(query.toLowerCase()) ||
      (item.author?.name?.toLowerCase().includes(query.toLowerCase()) ?? false),
    initialTab: 'all'
  });

  // 탭 정보
  const tabs: { id: ArticleTabType; label: string; count: number }[] = [
    { id: 'all', label: '전체', count: filteredItemsCount.all },
    { id: 'tips', label: '팁과 정보', count: filteredItemsCount.tips },
    { id: 'news', label: '뉴스', count: filteredItemsCount.news },
    { id: 'guide', label: '가이드', count: filteredItemsCount.guide }
  ];

  return (
    <>
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="mx-auto w-full">
        {visibleItems.length > 0 ? (
          <>
            <div className="space-y-6">
              {visibleItems.map(post => (
                <ArticleItem
                  key={post.id}
                  post={post}
                />
              ))}
            </div>
            {hasMore && (
              <LoadMoreButton
                onClick={handleLoadMore}
                label="더 많은 기사 보기"
              />
            )}
          </>
        ) : (
          <div className="mt-4 text-center text-gray-500">
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    </>
  );
}
