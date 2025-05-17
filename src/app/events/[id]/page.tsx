import React from 'react';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import { EventCard } from '@/app/events/[id]/_components/EventCard';
import { eventDetails } from '@/app/_constants/eventData';
import { notFound } from 'next/navigation';

export default async function EventDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  // Next.js 15에서는 params가 Promise이므로 await로 처리해야 함
  const params = await props.params;
  const eventId = params.id;

  // URL의 id 파라미터로 해당 이벤트 찾기
  const eventDetail = eventDetails.find(event => event.id === eventId);

  // 이벤트가 없으면 404 메시지 표시
  if (!eventDetail) {
    notFound();
  }

  return (
    <>
      <BackgroundImage src={eventDetail.imageUrl} />
      <ContentsLayout>
        <Header
          title={eventDetail.title}
          showNotification
          showBack
          showMenuButton
        />
        
        <EventCard eventData={{ ...eventDetail, id: eventId }} />
      </ContentsLayout>
    </>
  );
}
