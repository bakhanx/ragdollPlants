'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { EventCardProps } from '@/types/components/events';

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href={event.link}
      className="block">
      <div
        className={`relative h-40 w-full overflow-hidden rounded-lg transition-shadow hover:shadow-lg ${event.isEnded ? 'grayscale' : ''}`}>
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          className="object-cover"
        />

        {/* 오버레이 - 종료된 이벤트는 더 어두운 오버레이 적용 */}
        <div
          className={`absolute inset-0 bg-gradient-to-t ${event.isEnded ? 'from-black/80 to-black/40' : 'from-black/70 to-transparent'}`}
        />

        {/* 종료 뱃지 */}
        {event.isEnded && (
          <div className="absolute top-3 right-3 rounded bg-red-500/80 px-2 py-1 text-xs font-medium text-white">
            종료
          </div>
        )}

        {/* 이벤트 정보 */}
        <div className="absolute bottom-0 left-0 z-10 p-4 text-white">
          <p className="text-sm opacity-80">{event.subtitle}</p>
          <h2 className="text-lg font-bold">{event.title}</h2>
        </div>
      </div>
    </Link>
  );
}
