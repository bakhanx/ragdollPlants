'use client';

import { useTabItems } from '@/app/_hooks/useTabItems';
import { SearchInput } from '@/app/_components/common/SearchInput';
import { LoadMoreButton } from '@/app/_components/common/LoadMoreButton';
import { TabNavigation } from '@/app/_components/common/TabNavigation';
import EventCard from './EventCard';
import { UploadButton } from '@/app/_components/common/UploadButton';
import { EventListProps, EventWithAuthor } from '@/types/components/events';
import { EventTabType } from '@/types/models/event';

export default function EventList({
  initialActiveEvents,
  initialEndedEvents,
  isAdmin
}: EventListProps) {
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
  } = useTabItems<EventWithAuthor, EventTabType>({
    allItems,
    filterFn: (item, query) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()),
    initialTab: 'active'
  });

  const tabs: { id: EventTabType; label: string; count: number }[] = [
    {
      id: 'active',
      label: '진행 중인 이벤트',
      count: filteredItemsCount.active
    },
    { id: 'ended', label: '종료된 이벤트', count: filteredItemsCount.ended }
  ];

  return (
    <>
      <div className="mt-4 mb-6 flex items-center justify-between">
        <div className="w-full max-w-xs">
          <SearchInput
            onSearch={handleSearch}
            placeholder="이벤트 검색"
          />
        </div>
        {isAdmin && (
          <UploadButton
            link="/events/upload"
            title="이벤트 등록"
          />
        )}
      </div>
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="mx-auto w-full max-w-md">
        {visibleItems.length > 0 ? (
          <>
            <div className="space-y-4">
              {visibleItems.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                />
              ))}
            </div>
            {hasMore && (
              <LoadMoreButton
                onClick={handleLoadMore}
                label="더 많은 이벤트 보기"
              />
            )}
          </>
        ) : (
          <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-gray-50 text-center">
            <p className="mb-2 text-gray-200">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </>
  );
}
