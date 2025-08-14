'use client';

import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTabItems } from '@/app/_hooks/useTabItems';
import { LoadMoreButton } from '@/app/_components/common/LoadMoreButton';
import { TabNavigation } from '@/app/_components/common/TabNavigation';
import { SearchInput } from '@/app/_components/common/SearchInput';
import EventCard from './EventCard';
import { EventsResponse, CachedEvent } from '@/types/cache/event';
import { EventTabType } from '@/types/models/event';

interface EventListProps {
  initialData: EventsResponse | null;
  isAdmin: boolean;
}

export default function EventList({ initialData, isAdmin }: EventListProps) {
  const router = useRouter();

  // 날짜 체크 및 새로고침
  useEffect(() => {
    const STORAGE_KEY = 'event_page_date_check';
    const today = new Date().toDateString();
    const lastCheck = localStorage.getItem(STORAGE_KEY);

    if (lastCheck && lastCheck !== today) {
      // 날짜가 바뀜 - 이벤트 상태 변경 가능성
      localStorage.setItem(STORAGE_KEY, today);
      router.refresh();
    } else if (!lastCheck) {
      localStorage.setItem(STORAGE_KEY, today);
    }
  }, [router]);

  const events = initialData?.events || [];

  const activeEvents = events.filter(event => !event.isEnded);
  const endedEvents = events.filter(event => event.isEnded);

  // allItems 객체만 메모이제이션 (참조 안정성)
  // 길이 변화로 의존성 체크 단순화
  const allItems = useMemo(
    () => ({
      active: activeEvents,
      ended: endedEvents
    }),
    [activeEvents.length, endedEvents.length]
  );

  // 탭/검색/더보기 등 상태 관리
  const {
    activeTab,
    setActiveTab,
    visibleItems,
    hasMore,
    handleSearch,
    handleLoadMore,
    filteredItemsCount
  } = useTabItems<CachedEvent, EventTabType>({
    allItems,
    filterFn: (item: CachedEvent, query: string) => {
      const lowerQuery = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(lowerQuery) ||
        (item.subtitle?.toLowerCase().includes(lowerQuery) ?? false)
      );
    },
    initialTab: 'active'
  });

  const tabs: { id: EventTabType; label: string; count: number }[] = [
    {
      id: 'active',
      label: '진행 중인 이벤트',
      count: filteredItemsCount.active
    },
    {
      id: 'ended',
      label: '종료된 이벤트',
      count: filteredItemsCount.ended
    }
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

  if (events.length === 0) {
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
              d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          아직 등록된 이벤트가 없어요
        </h3>
        <p className="mb-6 text-gray-500">첫 번째 이벤트를 등록해보세요!</p>
      </div>
    );
  }

  return (
    <>
      {/* 검색 입력 */}
      <div className="mb-6">
        <SearchInput
          placeholder="이벤트 검색"
          onSearch={handleSearch}
        />
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
