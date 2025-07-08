import React from 'react';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import { EventCard } from '@/app/events/[id]/_components/EventCard';
import { notFound } from 'next/navigation';
import { getEventById } from '@/app/actions/events';
import { checkIsAdmin } from '@/lib/auth-utils';

export default async function EventDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const { id } = params;

  const isAdmin = await checkIsAdmin();

  try {
    const eventId = parseInt(id, 10);
    if (isNaN(eventId)) {
      notFound();
    }

    const event = await getEventById(eventId);

    return (
      <>
        <BackgroundImage src={event.image} />
        <ContentsLayout noPadding>
          <Header
            title={event.title}
            id={id}
            showBack
            showContentMenu={isAdmin}
            showNotification
            variant="glass"
            contentType="event"
            isOwner={isAdmin}
          />

          <div className="w-full rounded-2xl">
            <EventCard eventData={event} />
          </div>
        </ContentsLayout>
      </>
    );
  } catch (error) {
    console.error('이벤트 조회 오류:', error);
    notFound();
  }
}
