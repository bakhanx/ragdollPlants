import React from 'react';
import Link from 'next/link';

interface EventInfoProps {
  subtitle: string;
  title: string;
  period: string;
  description: string;
  content: string;
  isEnded: boolean;
}

export const EventInfo = ({
  subtitle,
  title,
  period,
  description,
  content,
  isEnded,
}: EventInfoProps) => {
  return (
    <div className="rounded-lg bg-white/90 p-4 shadow-lg">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <p className="mb-1 text-sm text-green-600">{subtitle}</p>
          {isEnded && (
            <span className="rounded bg-gray-500 px-2 py-1 text-xs text-white">
              종료
            </span>
          )}
        </div>
        <h1 className="mb-2 text-xl font-bold">{title}</h1>
        <p className="mb-4 text-sm text-gray-600">기간: {period}</p>
        <div className="my-3 h-px bg-gray-200"></div>
        <p className="mb-4 text-gray-700">{description}</p>
        <div className="rounded-md bg-gray-50 p-3 whitespace-pre-line">
          {content}
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