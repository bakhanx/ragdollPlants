import BackgroundImage from '../_components/layout/BackgroundImage';
import { ContentsLayout } from '../_components/layout/ContentsLayout';
import { Header } from '../_components/header/Header';
import { auth } from '@/auth';
import { getEvents } from '../actions/events';
import EventList from './_components/EventList';

export default async function EventsPage() {
  const session = await auth();
  const isAdmin = session?.user?.role === 'ADMIN';

  const events = await getEvents();

  const activeEvents = events.filter(event => !event.isEnded);
  const endedEvents = events.filter(event => event.isEnded);

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-05.webp" />
      <ContentsLayout>
        <Header
          title="이벤트"
          showNotification
        />
        <EventList
          initialActiveEvents={activeEvents}
          initialEndedEvents={endedEvents}
          isAdmin={isAdmin}
        />
      </ContentsLayout>
    </>
  );
}
