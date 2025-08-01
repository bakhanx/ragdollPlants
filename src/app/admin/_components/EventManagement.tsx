'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/app/_components/common/Button';
import Link from 'next/link';

interface Event {
  id: number;
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  isEnded: boolean;
  isActive: boolean;
  viewCount: number;
  participants: number;
}

export default function EventManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // 이벤트 목록 가져오기
  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
      }
    } catch (error) {
      console.error('이벤트 목록 로딩 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // 이벤트 상태 토글 (진행중 ↔ 종료)
  const toggleEventStatus = async (eventId: number, currentStatus: boolean) => {
    setIsUpdating(eventId);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/events/${eventId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isEnded: !currentStatus }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(`✅ ${result.message}`);
        // 목록 새로고침
        await fetchEvents();
      } else {
        const error = await response.json();
        setMessage(`❌ ${error.error}`);
      }
    } catch (error) {
      console.error('이벤트 상태 변경 오류:', error);
      setMessage('❌ 상태 변경 중 오류가 발생했습니다');
    } finally {
      setIsUpdating(null);
    }
  };

  // 이벤트 삭제
  const deleteEvent = async (eventId: number, title: string) => {
    if (!confirm(`"${title}" 이벤트를 삭제하시겠습니까?`)) {
      return;
    }

    setIsUpdating(eventId);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('✅ 이벤트가 삭제되었습니다');
        await fetchEvents();
      } else {
        const error = await response.json();
        setMessage(`❌ ${error.error}`);
      }
    } catch (error) {
      console.error('이벤트 삭제 오류:', error);
      setMessage('❌ 삭제 중 오류가 발생했습니다');
    } finally {
      setIsUpdating(null);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow border-l-4 border-purple-500">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">이벤트 관리</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">이벤트 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow border-l-4 border-purple-500">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">이벤트 관리</h2>
        <Link 
          href="/events/upload"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + 새 이벤트 생성
        </Link>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          message.includes('✅') 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {events.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>등록된 이벤트가 없습니다.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이벤트 정보
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  기간
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  통계
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {event.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {event.subtitle}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    <div>
                      <div>시작: {new Date(event.startDate).toLocaleDateString('ko-KR')}</div>
                      <div>종료: {new Date(event.endDate).toLocaleDateString('ko-KR')}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        event.isEnded 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {event.isEnded ? '종료됨' : '진행중'}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        event.isActive 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {event.isActive ? '활성' : '비활성'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    <div>
                      <div>조회: {event.viewCount}회</div>
                      <div>참여: {event.participants}명</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-1">
                        <Link
                          href={`/events/${event.id}`}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                        >
                          보기
                        </Link>
                        <span className="text-gray-300">|</span>
                        <Link
                          href={`/events/${event.id}/edit`}
                          className="text-green-600 hover:text-green-800 text-xs font-medium"
                        >
                          수정
                        </Link>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => toggleEventStatus(event.id, event.isEnded)}
                          disabled={isUpdating === event.id}
                          className={`text-xs font-medium ${
                            event.isEnded 
                              ? 'text-green-600 hover:text-green-800' 
                              : 'text-orange-600 hover:text-orange-800'
                          } disabled:opacity-50`}
                        >
                          {isUpdating === event.id ? '처리중...' : (event.isEnded ? '재시작' : '종료')}
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => deleteEvent(event.id, event.title)}
                          disabled={isUpdating === event.id}
                          className="text-red-600 hover:text-red-800 text-xs font-medium disabled:opacity-50"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        <p>💡 종료된 이벤트를 &quot;재시작&quot;하면 진행중 상태로 변경됩니다.</p>
        <p>📝 날짜 변경은 &quot;수정&quot; 버튼을 통해 개별 수정하세요.</p>
      </div>
    </div>
  );
}