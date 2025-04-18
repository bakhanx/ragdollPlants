import React from 'react';
import BackgroundImage from '../_components/layout/BackgroundImage';
import ContentLayout from '../_components/layout/ContentsLayout';
import Header from '../_components/layout/Header';
import { bannerItems, endedEvents } from '@/app/_constants/eventData';
import { EventList } from './_components';

export default function EventsPage() {
  return (
    <>
      <BackgroundImage src="/images/welcome-bg-05.webp" />
      <ContentLayout>
        <Header
          title="이벤트"
          showNotification
        />

        <div className="mx-auto flex w-full max-w-md flex-col gap-y-8 py-4">
          {/* 진행 중인 이벤트 */}
          <EventList
            title="진행 중인 이벤트"
            events={bannerItems}
          />

          {/* 종료된 이벤트 */}
          <EventList
            title="종료된 이벤트"
            events={endedEvents}
          />
        </div>
      </ContentLayout>
    </>
  );
}
