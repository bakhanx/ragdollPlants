'use client';

import { useTabItems } from '@/app/_hooks/useTabItems';
import SearchInput from '@/app/_components/common/SearchInput';
import LoadMoreButton from '@/app/_components/common/LoadMoreButton';
import TabNavigation from '@/app/_components/common/TabNavigation';
import EventCard from './EventCard';

export type BannerItem = {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
  isEnded?: boolean;
};

export type EventTabType = 'active' | 'ended';

export default function EventList({
  initialActiveEvents,
  initialEndedEvents
}: {
  initialActiveEvents: BannerItem[];
  initialEndedEvents: BannerItem[];
}) {
  // 탭별 데이터 구성
  const allItems = {
    active: initialActiveEvents,
    ended: initialEndedEvents
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
  } = useTabItems<BannerItem, EventTabType>({
    allItems,
    filterFn: (item, query) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()),
    initialTab: 'active'
  });

  const tabs: { id: EventTabType; label: string; count: number }[] = [
    { id: 'active', label: '진행 중인 이벤트', count: filteredItemsCount.active },
    { id: 'ended', label: '종료된 이벤트', count: filteredItemsCount.ended }
  ];

  return (
    <>
      <div className="mb-6 mt-4 flex justify-between items-center">
        <div className="max-w-xs">
          <SearchInput onSearch={handleSearch} placeholder="이벤트 검색" />
        </div>
      </div>
      <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="mx-auto w-full max-w-md">
        {visibleItems.length > 0 ? (
          <>
            <div className="space-y-4">
              {visibleItems.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            {hasMore && (
              <LoadMoreButton onClick={handleLoadMore} label="더 많은 이벤트 보기" />
            )}
          </>
        ) : (
          <div className="mt-4 text-center text-gray-50">검색 결과가 없습니다.</div>
        )}
      </div>
    </>
  );
}
