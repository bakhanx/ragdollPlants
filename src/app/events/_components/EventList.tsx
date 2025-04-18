'use client';

import React from 'react';
import { BannerItem } from '@/app/_constants/eventData';
import EventCard from './EventCard';

interface EventListProps {
  title: string;
  events: BannerItem[];
}

export default function EventList({ title, events }: EventListProps) {
  if (events.length === 0) {
    return null;
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-gray-50">{title}</h1>

      <div className="space-y-4">
        {events.map(event => (
          <EventCard
            key={event.id}
            event={event}
          />
        ))}
      </div>
    </div>
  );
}
