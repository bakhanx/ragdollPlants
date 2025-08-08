'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toggleEventEndStatus } from '@/app/actions/events';
import { formatDate } from '@/app/_utils/dateUtils';

interface EventInfoProps {
  event: {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    content: string;
    startDate: Date;
    endDate: Date;
    isEnded: boolean;
  };
  isAdmin: boolean;
}

export const EventInfo = ({ event, isAdmin }: EventInfoProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleEnd = async () => {
    if (!isAdmin || isSubmitting) return;

    if (!confirm('이벤트를 조기 종료하시겠습니까?')) return;

    setIsSubmitting(true);
    try {
      await toggleEventEndStatus(event.id);
      router.refresh();
    } catch (error) {
      console.error('이벤트 상태 변경 실패:', error);
      alert('이벤트 상태 변경에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const period = `${formatDate(event.startDate)} - ${formatDate(event.endDate)}`;

  return (
    <div className="relative rounded-lg bg-white/90 p-4 shadow-lg">
      {/* 관리자용 조기 종료 버튼 */}
      {isAdmin && !event.isEnded && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleToggleEnd}
            disabled={isSubmitting}
            className="w-18 rounded-md bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">
            {isSubmitting ? '처리 중...' : '조기 종료'}
          </button>
        </div>
      )}

      <div className="mb-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="mb-1 text-sm text-green-600">{event.subtitle}</p>
            <h1 className="mb-2 text-xl font-bold">{event.title}</h1>
          </div>
          {event.isEnded && (
            <span className="rounded bg-gray-500 px-2 py-1 text-xs whitespace-nowrap text-white">
              종료
            </span>
          )}
        </div>

        <p className="mb-4 text-sm text-gray-600">기간: {period}</p>
        <div className="my-3 h-px bg-gray-200"></div>
        <p className="mb-4 text-gray-700">{event.description}</p>
        <div className="rounded-md bg-gray-50 p-3 whitespace-pre-line">
          {event.content}
        </div>
      </div>

      <Link
        href="/events"
        className="block w-full rounded-md bg-green-600 py-2 text-center text-white transition-colors hover:bg-green-700">
        다른 이벤트 보기
      </Link>
    </div>
  );
};
