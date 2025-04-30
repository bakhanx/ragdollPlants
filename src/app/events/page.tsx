import BackgroundImage from '../_components/layout/BackgroundImage';
import { ContentsLayout } from '../_components/layout/ContentsLayout';
import { Header } from '../_components/header/Header';
import { bannerItems, endedEvents } from '@/app/_constants/eventData';
import EventList from './_components/EventList';

export default function EventsPage() {
  return (
    <>
      <BackgroundImage src="/images/welcome-bg-05.webp" />
      <ContentsLayout>
        <Header
          title="이벤트"
          showNotification
        />
        <EventList
          initialActiveEvents={bannerItems}
          initialEndedEvents={endedEvents}
        />
      </ContentsLayout>
    </>
  );
}
