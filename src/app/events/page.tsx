import React from 'react';
import BackgroundImage from '../_components/layout/BackgroundImage';
import ContentLayout from '../_components/layout/ContentsLayout';
import Header from '../_components/layout/Header';
import Link from 'next/link';
import Image from 'next/image';
import { BannerItem } from '../_components/layout/Banner';

// 이벤트 데이터 - Banner 컴포넌트에서 사용하는 데이터와 동일하게 유지하는 것이 좋음
// 실제 구현에서는 이 데이터를 별도의 파일로 분리하여 공유하는 것이 좋음
const eventItems: BannerItem[] = [
  {
    id: 1,
    title: '봄맞이 가드닝 이벤트',
    subtitle: '신규 회원 20% 할인',
    imageUrl: '/images/welcome-bg-02.webp',
    link: '/events/spring-gardening'
  },
  {
    id: 2,
    title: '다육식물 특별전',
    subtitle: '인기 다육식물 모음',
    imageUrl: '/images/welcome-bg-03.webp',
    link: '/events/succulent-exhibition'
  },
  {
    id: 3,
    title: '가드닝 클래스 모집',
    subtitle: '전문가와 함께하는 원데이 클래스',
    imageUrl: '/images/welcome-bg-04.webp',
    link: '/events/gardening-class'
  },
  {
    id: 4,
    title: '공기정화 식물 특집',
    subtitle: '실내 공기를 깨끗하게',
    imageUrl: '/images/welcome-bg-01.webp',
    link: '/events/air-purifying-plants'
  }
];

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
            {eventItems.map(event => (
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
