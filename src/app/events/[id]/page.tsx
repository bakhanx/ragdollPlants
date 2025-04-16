import React from 'react';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import ContentLayout from '@/app/_components/layout/ContentsLayout';
import Header from '@/app/_components/layout/Header';
import Image from 'next/image';
import Link from 'next/link';
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
      <BackgroundImage
        src={eventDetail.imageUrl}
        overlay={true}
      />
      <ContentLayout>
        <Header 
          title="이벤트" 
          showBackButton
        />
        
        <div className="w-full max-w-md mx-auto py-4">
          {/* 이벤트 헤더 이미지 */}
          <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
            <Image
              src={eventDetail.imageUrl}
              alt={eventDetail.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
          
          {/* 이벤트 정보 */}
          <div className="bg-white/90 rounded-lg p-4 shadow-lg">
            <div className="mb-4">
              <p className="text-sm text-green-600 mb-1">{eventDetail.subtitle}</p>
              <h1 className="text-xl font-bold mb-2">{eventDetail.title}</h1>
              <p className="text-sm text-gray-600 mb-4">기간: {eventDetail.period}</p>
              <div className="h-px bg-gray-200 my-3"></div>
              <p className="text-gray-700 mb-4">{eventDetail.description}</p>
              <div className="bg-gray-50 p-3 rounded-md whitespace-pre-line">
                {eventDetail.content}
              </div>
            </div>
            
            <Link 
              href="/events" 
              className="block w-full bg-green-600 text-white text-center py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              다른 이벤트 보기
            </Link>
          </div>
        </div>
      </ContentLayout>
    </>
  );
} 