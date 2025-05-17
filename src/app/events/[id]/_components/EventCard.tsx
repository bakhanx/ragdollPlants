import React from 'react';
import { EventHeaderImage } from './EventHeaderImage';
import { EventInfo } from './EventInfo';

interface EventCardProps {
  eventData: {
    id: string;
    imageUrl: string;
    title: string;
    subtitle: string;
    period: string;
    description: string;
    content: string;
    isEnded?: boolean;
  };
}

export const EventCard = ({ eventData }: EventCardProps) => {
  // isEnded에 기본값 설정
  const isEnded = eventData.isEnded ?? false;

  return (
    <div className="mx-auto w-full max-w-md py-4">
      <EventHeaderImage
        imageUrl={eventData.imageUrl}
        title={eventData.title}
        isEnded={isEnded}
        eventId={eventData.id}
      />

      <EventInfo
        subtitle={eventData.subtitle}
        title={eventData.title}
        period={eventData.period}
        description={eventData.description}
        content={eventData.content}
        isEnded={isEnded}
      />
    </div>
  );
};
