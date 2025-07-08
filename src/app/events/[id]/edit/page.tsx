import React from 'react';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import { EventUploadForm } from '@/app/events/upload/_components/EventUploadForm';
import { notFound } from 'next/navigation';
import { getEventById } from '@/app/actions/events';

interface EditEventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditEventPage({
  params
}: EditEventPageProps) {
  try {
    const { id } = await params;

    // ID를 숫자로 변환
    const eventId = parseInt(id, 10);
    if (isNaN(eventId)) {
      notFound();
    }

    const event = await getEventById(eventId);

    // EventUploadForm에 맞는 형태로 데이터 변환
    const eventData = {
      id: event.id.toString(),
      title: event.title,
      subtitle: event.subtitle,
      description: event.description,
      content: event.content,
      image: event.image,
      startDate: event.startDate,
      endDate: event.endDate
    };

    return (
      <>
        <BackgroundImage src="/images/welcome-bg-03.webp" />
        <ContentsLayout>
          <Header
            title="이벤트 수정"
            showBack
          />

          <EventUploadForm
            mode="edit"
            initialData={eventData}
          />
        </ContentsLayout>
      </>
    );
  } catch (error) {
    console.error('이벤트 정보 로딩 오류:', error);
    notFound();
  }
} 