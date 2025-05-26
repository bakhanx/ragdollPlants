'use client';

import { useMemo } from 'react';
import { useTabItems } from '@/app/_hooks/useTabItems';
import { SearchInput } from '@/app/_components/common/SearchInput';
import { LoadMoreButton } from '@/app/_components/common/LoadMoreButton';
import { TabNavigation } from '@/app/_components/common/TabNavigation';
import { inferArticleCategory } from '@/app/_utils/categoryUtils';
import { ArticleItem } from './ArticleItem';
import { UploadButton } from '@/app/_components/common/UploadButton';
import { useAuth } from '@/app/_hooks/useAuth';
import { ArticleWithNumberId, ArticleTabType } from '@/types/models/article';

export default function ArticleList({
  initialArticles
}: {
  initialArticles: ArticleWithNumberId[];
}) {
  // 카테고리별로 분류
  const allItems = useMemo<Record<ArticleTabType, ArticleWithNumberId[]>>(() => {
    const withCategory = initialArticles.map(article => ({
      ...article,
      category:
        article.category ||
        inferArticleCategory(article.title, article.content, article.tags)
    }));
    return {
      all: withCategory,
      tips: withCategory.filter(a => a.category === 'tips'),
      news: withCategory.filter(a => a.category === 'news'),
      guide: withCategory.filter(a => a.category === 'guide')
    };
  }, [initialArticles]);

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

  const { isAdmin } = useAuth();

  // 탭 정보
  const tabs: { id: ArticleTabType; label: string; count: number }[] = [
    { id: 'all', label: '전체', count: filteredItemsCount.all },
    { id: 'tips', label: '팁과 정보', count: filteredItemsCount.tips },
    { id: 'news', label: '뉴스', count: filteredItemsCount.news },
    { id: 'guide', label: '가이드', count: filteredItemsCount.guide }
  ];

  return (
    <>
      <div className="mt-4 mb-6 flex items-center justify-between">
        <div className="w-full max-w-xs">
          <SearchInput
            onSearch={handleSearch}
            placeholder="기사 검색"
          />
        </div>
        {isAdmin && (
          <UploadButton
            link="/articles/upload"
            title="기사 등록"
          />
        )}
      </div>
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="mx-auto w-full">
        {visibleItems.length > 0 ? (
          <>
            <div className={`space-y-6`}>
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
