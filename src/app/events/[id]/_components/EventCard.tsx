'use client';

import React from 'react';
import { EventHeaderImage } from './EventHeaderImage';
import { EventInfo } from './EventInfo';

interface EventCardProps {
  eventData: {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    content: string;
    image: string;
    startDate: string;
    endDate: string;
    isEnded: boolean;
    viewCount: number;
    createdAt: string;
    updatedAt: string;
    author: {
      id: string;
      name: string | null;
      image: string | null;
    };
  };
  isAdmin: boolean;
}

export const EventCard = ({ eventData, isAdmin }: EventCardProps) => {
  const isEnded = eventData.isEnded;
  const now = new Date();
  const isEarlyTerminated = eventData.isEnded && new Date(eventData.endDate) > now;

  return (
    <div className="mx-auto w-full max-w-md">
      <EventHeaderImage
        imageUrl={eventData.image}
        title={eventData.title}
        isEnded={isEnded}
        isEarlyTerminated={isEarlyTerminated}
        eventId={eventData.id.toString()}
      />

      <EventInfo
        event={eventData}
        isAdmin={isAdmin}
      />
    </div>
  );
};
