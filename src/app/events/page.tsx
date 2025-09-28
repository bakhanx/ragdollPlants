import { Suspense } from 'react';
import BackgroundImage from '../_components/layout/BackgroundImage';
import { ContentsLayout } from '../_components/layout/ContentsLayout';
import { Header } from '../_components/header/Header';
import EventListWrapper from './_components/EventListWrapper';
import EventCardsSkeleton from './_components/EventCardsSkeleton';

export default async function EventsPage() {
  return (
    <>
      <BackgroundImage src="/images/welcome-bg-05.webp" />
      <ContentsLayout>
        <Header title="이벤트" />

        <div className="w-full py-4">
          {/* 이벤트 목록  */}
          <Suspense fallback={<EventCardsSkeleton />}>
            <EventListWrapper />
          </Suspense>
        </div>
      </ContentsLayout>
    </>
  );
}
