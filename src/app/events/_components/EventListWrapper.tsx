import { getEvents } from '@/app/actions/events';
import { checkIsAdmin } from '@/lib/auth-utils';
import EventList from './EventList';

export default async function EventListWrapper() {
  let events: Awaited<ReturnType<typeof getEvents>> = [];
  let isAdmin = false;
  let hasError = false;

  try {
    [events, isAdmin] = await Promise.all([getEvents(), checkIsAdmin()]);
  } catch (error) {
    console.error('이벤트 목록 로딩 오류:', error);
    hasError = true;
  }

  if (hasError) {
    return (
      <div className="mb-4 rounded-lg bg-red-50 p-4 text-center">
        <p className="text-red-600">
          이벤트 데이터를 불러오는 중 오류가 발생했습니다.
        </p>
        <p className="text-sm text-red-500">페이지를 새로고침해 주세요.</p>
      </div>
    );
  }

  const activeEvents = events.filter(event => !event.isEnded);
  const endedEvents = events.filter(event => event.isEnded);

  return (
    <EventList
      initialActiveEvents={activeEvents}
      initialEndedEvents={endedEvents}
      isAdmin={isAdmin}
    />
  );
}
