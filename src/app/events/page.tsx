import React from 'react';
import BackgroundImage from '../_components/layout/BackgroundImage';
import ContentLayout from '../_components/layout/ContentsLayout';
import Header from '../_components/layout/Header';
import Link from 'next/link';
import Image from 'next/image';
import { bannerItems } from '@/app/_constants/eventData';

export default function EventsPage() {
  return (
    <>
      <BackgroundImage
        src="/images/welcome-bg-05.webp"
        overlay={true}
      />
      <ContentLayout>
        <Header
          title="이벤트"
          showMenuButton
          showNotification
        />

        <div className="mx-auto w-full max-w-md py-4">
          <h1 className="mb-4 text-xl font-bold">진행 중인 이벤트</h1>

          <div className="space-y-4">
            {bannerItems.map(event => (
              <Link
                key={event.id}
                href={event.link}
                className="block">
                <div className="relative h-40 w-full overflow-hidden rounded-lg transition-shadow hover:shadow-lg">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />

                  {/* 오버레이 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  {/* 이벤트 정보 */}
                  <div className="absolute bottom-0 left-0 z-10 p-4 text-white">
                    <p className="text-sm opacity-80">{event.subtitle}</p>
                    <h2 className="text-lg font-bold">{event.title}</h2>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </ContentLayout>
    </>
  );
}
