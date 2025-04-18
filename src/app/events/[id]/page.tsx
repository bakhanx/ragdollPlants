import React from 'react';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import ContentLayout from '@/app/_components/layout/ContentsLayout';
import Header from '@/app/_components/layout/Header';
import Image from 'next/image';
import Link from 'next/link';
import { eventDetails } from '@/app/_constants/eventData';
import { notFound } from 'next/navigation';
import ShareButton from '@/app/_components/common/ShareButton';

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
      <ContentLayout>
        <Header
          title={eventDetail.title}
          showBackButton
          showNotification
          showMenuButton
        />

        <div className="mx-auto w-full max-w-md py-4">
          {/* 이벤트 헤더 이미지 */}
          <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg">
            <Image
              src={eventDetail.imageUrl}
              alt={eventDetail.title}
              fill
              className={`object-cover ${eventDetail.isEnded ? 'grayscale' : ''}`}
            />

            {!eventDetail.isEnded && (
              <div className="absolute right-2 bottom-2 z-20">
                <ShareButton
                  url={`${process.env.NEXT_PUBLIC_APP_URL}/events/${eventId}`}
                  title={eventDetail.title}
                />
              </div>
            )}

            {/* 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

            {/* 종료된 이벤트 표시 */}
            {eventDetail.isEnded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-md bg-gray-500 px-4 py-2">
                  <span className="text-lg font-bold text-white">
                    종료된 이벤트
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 이벤트 정보 */}
          <div className="rounded-lg bg-white/90 p-4 shadow-lg">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <p className="mb-1 text-sm text-green-600">
                  {eventDetail.subtitle}
                </p>
                {eventDetail.isEnded && (
                  <span className="rounded bg-gray-500 px-2 py-1 text-xs text-white">
                    종료
                  </span>
                )}
              </div>
              <h1 className="mb-2 text-xl font-bold">{eventDetail.title}</h1>
              <p className="mb-4 text-sm text-gray-600">
                기간: {eventDetail.period}
              </p>
              <div className="my-3 h-px bg-gray-200"></div>
              <p className="mb-4 text-gray-700">{eventDetail.description}</p>
              <div className="rounded-md bg-gray-50 p-3 whitespace-pre-line">
                {eventDetail.content}
              </div>
            </div>

            <Link
              href="/events"
              className="block w-full rounded-md bg-green-600 py-2 text-center text-white transition-colors hover:bg-green-700">
              다른 이벤트 보기
            </Link>
          </div>
        </div>
      </ContentLayout>
    </>
  );
}
