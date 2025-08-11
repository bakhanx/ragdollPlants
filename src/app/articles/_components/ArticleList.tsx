'use client';

import { useTabItems } from '@/app/_hooks/useTabItems';
import { TabNavigation } from '@/app/_components/common/TabNavigation';
import { LoadMoreButton } from '@/app/_components/common/LoadMoreButton';
import { SearchInput } from '@/app/_components/common/SearchInput';
import { ArticleItem } from './ArticleItem';
import { ArticleTabType } from '@/types/models/article';

import { CachedArticle } from '@/types/cache/article';

interface ArticleListProps {
  initialData: CachedArticle[] | null;
}

export default function ArticleList({ initialData }: ArticleListProps) {
  const articles = initialData || [];

  // 카테고리별 분류 (서버에서 받은 데이터 기준)
  const allArticles = articles;
  const tipsArticles = articles.filter(a => a.category?.name === 'tips');
  const newsArticles = articles.filter(a => a.category?.name === 'news');
  const guideArticles = articles.filter(a => a.category?.name === 'guide');

  // 서버에서 미리 분류된 정적 객체 (Event 페이지와 동일한 패턴)
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
  } = useTabItems<CachedArticle, ArticleTabType>({
    allItems,
    filterFn: (item, query) =>
      item.title.toLowerCase().includes(query.toLowerCase()),
    initialTab: 'all'
  });

  // 탭 정보
  const tabs: { id: ArticleTabType; label: string; count: number }[] = [
    { id: 'all', label: '전체', count: filteredItemsCount.all },
    { id: 'tips', label: '팁과 정보', count: filteredItemsCount.tips },
    { id: 'news', label: '뉴스', count: filteredItemsCount.news },
    { id: 'guide', label: '가이드', count: filteredItemsCount.guide }
  ];

  if (!initialData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 text-red-400">
          <svg
            className="mx-auto mb-4 h-16 w-16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          데이터를 불러올 수 없어요
        </h3>
        <p className="mb-6 text-gray-500">페이지를 새로고침해 주세요.</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 text-gray-400">
          <svg
            className="mx-auto mb-4 h-16 w-16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          아직 등록된 아티클이 없어요
        </h3>
        <p className="mb-6 text-gray-500">첫 번째 아티클을 작성해보세요!</p>
      </div>
    );
  }

  return (
    <>
      {/* 검색 입력 */}
      <div className="mb-6">
        <SearchInput
          placeholder="기사 검색..."
          onSearch={handleSearch}
        />
      </div>

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
