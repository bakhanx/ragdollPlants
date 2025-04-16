import React from 'react';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import ContentLayout from '@/app/_components/layout/ContentsLayout';
import Header from '@/app/_components/layout/Header';
import Image from 'next/image';
import Link from 'next/link';
import { BannerItem } from '@/app/_components/layout/Banner';

// 이벤트 데이터 - Banner 컴포넌트와 events 페이지에서 사용하는 데이터와 동일
// 실제 구현에서는 이 데이터를 별도의 파일로 분리하여 공유하는 것이 좋음
const eventItems: BannerItem[] = [
  {
    id: 1,
    title: "봄맞이 가드닝 이벤트",
    subtitle: "신규 회원 20% 할인",
    imageUrl: "/images/welcome-bg-02.webp",
    link: "/events/spring-gardening"
  },
  {
    id: 2,
    title: "다육식물 특별전",
    subtitle: "인기 다육식물 모음",
    imageUrl: "/images/welcome-bg-03.webp",
    link: "/events/succulent-exhibition"
  },
  {
    id: 3,
    title: "가드닝 클래스 모집",
    subtitle: "전문가와 함께하는 원데이 클래스",
    imageUrl: "/images/welcome-bg-04.webp",
    link: "/events/gardening-class"
  },
  {
    id: 4,
    title: "공기정화 식물 특집",
    subtitle: "실내 공기를 깨끗하게",
    imageUrl: "/images/welcome-bg-01.webp",
    link: "/events/air-purifying-plants"
  }
];

// 이벤트 상세 정보 (실제로는 API에서 가져올 내용)
const eventDetails = [
  {
    id: "spring-gardening",
    title: "봄맞이 가드닝 이벤트",
    subtitle: "신규 회원 20% 할인",
    imageUrl: "/images/welcome-bg-02.webp",
    period: "2024.05.01 ~ 2024.05.31",
    description: "봄을 맞이하여 정원 가꾸기를 시작하는 분들을 위한 특별 이벤트입니다. 이 기간 동안 신규 가입하시는 모든 회원분들께 식물 구매 시 20% 할인 혜택을 드립니다. 다양한 종류의 식물과 가드닝 도구를 할인된 가격으로 만나보세요.",
    content: "• 신규 회원 가입 시 즉시 사용 가능한 20% 할인 쿠폰 지급\n• 봄 시즌 한정 특별 식물 컬렉션 공개\n• 가드닝 초보자를 위한 온라인 튜토리얼 무료 제공\n• 5만원 이상 구매 시 미니 화분 증정"
  },
  {
    id: "succulent-exhibition",
    title: "다육식물 특별전",
    subtitle: "인기 다육식물 모음",
    imageUrl: "/images/welcome-bg-03.webp",
    period: "2024.05.15 ~ 2024.06.15",
    description: "다양한 종류의 다육식물을 한자리에서 만나볼 수 있는 특별 전시회입니다. 희귀 다육식물부터 인기 품종까지, 다양한 다육식물을 전시하고 판매합니다.",
    content: "• 50여 종 이상의 다육식물 전시 및 판매\n• 다육식물 관리법 강연 및 워크샵\n• 다육식물 테라리움 만들기 체험\n• 인스타그램 인증샷 이벤트 - #다육특별전 해시태그 달고 인증 시 추첨을 통해 선물 증정"
  },
  {
    id: "gardening-class",
    title: "가드닝 클래스 모집",
    subtitle: "전문가와 함께하는 원데이 클래스",
    imageUrl: "/images/welcome-bg-04.webp",
    period: "2024.06.01 ~ 2024.06.30 (매주 토요일)",
    description: "식물 전문가와 함께하는 원데이 가드닝 클래스에 여러분을 초대합니다. 식물 관리의 기초부터 테라리움 만들기, 공중 식물 설치하기 등 다양한 주제로 클래스가 진행됩니다.",
    content: "• 6/1: 실내식물 관리의 기초\n• 6/8: 테라리움 만들기\n• 6/15: 행잉 플랜트와 마크라메\n• 6/22: 미니 정원 디자인\n• 6/29: 허브 가드닝과 활용법\n\n각 클래스는 재료비 포함 50,000원이며, 사전 예약이 필요합니다."
  },
  {
    id: "air-purifying-plants",
    title: "공기정화 식물 특집",
    subtitle: "실내 공기를 깨끗하게",
    imageUrl: "/images/welcome-bg-01.webp",
    period: "2024.06.15 ~ 2024.07.15",
    description: "실내 공기 질 개선에 도움을 주는 다양한 공기정화 식물을 소개합니다. 도시 생활 속에서 깨끗한 공기와 함께 하는 친환경 라이프스타일을 제안합니다.",
    content: "• 인기 공기정화 식물 20% 할인\n• 공기정화 효과 TOP 10 식물 소개\n• 식물 배치와 관리 방법 가이드북 증정\n• 2개 이상 구매 시 미니 가습기 증정 (선착순 100명)"
  }
];

export default function EventDetailPage({ params }: { params: { id: string } }) {
  // URL의 id 파라미터로 해당 이벤트 찾기
  const eventDetail = eventDetails.find(event => event.id === params.id);
  
  // 이벤트가 없으면 404 메시지 표시
  if (!eventDetail) {
    return (
      <>
        <BackgroundImage
          src="/images/welcome-bg-05.webp"
          overlay={true}
        />
        <ContentLayout>
          <Header 
            title="이벤트" 
            showBackButton
          />
          <div className="flex flex-col items-center justify-center h-64">
            <h1 className="text-xl font-bold mb-2">이벤트를 찾을 수 없습니다</h1>
            <Link href="/events" className="text-green-600 hover:underline">
              이벤트 목록으로 돌아가기
            </Link>
          </div>
        </ContentLayout>
      </>
    );
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