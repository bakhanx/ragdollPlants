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
    link: string;
    startDate: Date;
    endDate: Date;
    isEnded: boolean;
    viewCount: number;
    createdAt: Date;
    updatedAt: Date;
    author: {
      id: string;
      name: string | null;
      image: string | null;
    };
  };
}

export const EventCard = ({ eventData }: EventCardProps) => {
  const isEnded = eventData.isEnded;

  return (
    <div className="mx-auto w-full max-w-md">
      <EventHeaderImage
        imageUrl={eventData.image}
        title={eventData.title}
        isEnded={isEnded}
        eventId={eventData.id.toString()}
      />

      <EventInfo
        subtitle={eventData.subtitle}
        title={eventData.title}
        startDate={eventData.startDate}
        endDate={eventData.endDate}
        description={eventData.description}
        content={eventData.content}
        isEnded={isEnded}
      />
    </div>
  );
};
