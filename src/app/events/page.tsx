import BackgroundImage from '../_components/layout/BackgroundImage';
import ContentLayout from '../_components/layout/ContentsLayout';
import Header from '../_components/layout/Header';
import FloatingButton from '@/app/_components/common/UploadButton';
import { bannerItems, endedEvents } from '@/app/_constants/eventData';
import EventList from './_components/EventList';

export default function EventsPage() {
  return (
    <>
      <BackgroundImage src="/images/welcome-bg-05.webp" />
      <ContentLayout>
        <Header title="이벤트" showNotification />
        <EventList initialActiveEvents={bannerItems} initialEndedEvents={endedEvents} />
      </ContentLayout>
      <FloatingButton link="/events/create" adminOnly={true} />
    </>
  );
}
