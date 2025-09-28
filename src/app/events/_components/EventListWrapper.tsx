import { getEvents } from '@/app/actions/events';
import EventList from './EventList';

export default async function EventListWrapper() {
  let eventsData: Awaited<ReturnType<typeof getEvents>> | null = null;
  let hasError = false;

  try {
    eventsData = await getEvents();
  } catch (error) {
    console.error('이벤트 목록 로딩 오류:', error);
    hasError = true;
    eventsData = null;
  }

  if (hasError) {
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

  return (
    <EventList
      initialData={eventsData}
    />
  );
}
