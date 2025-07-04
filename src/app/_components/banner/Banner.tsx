'use client';

import React, { useState, useEffect } from 'react';

import BannerSlide from './BannerSlide';
import BannerNavigation from './BannerNavigation';
import BannerIndicators from './BannerIndicators';

interface BannerEvent {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  isEnded: boolean;
  createdAt?: Date;
}

interface BannerProps {
  events: BannerEvent[];
}

export const Banner = ({ events }: BannerProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = events.length || 1; // 최소 1개 슬라이드

  // 자동 슬라이드 기능 (이벤트가 2개 이상일 때만)
  useEffect(() => {
    if (totalSlides <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % totalSlides);
    }, 5000); // 5초마다 슬라이드 변경

    return () => clearInterval(interval);
  }, [totalSlides]);

  // 이전 슬라이드로 이동
  const goToPrevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  // 다음 슬라이드로 이동
  const goToNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  };

  // 특정 슬라이드로 직접 이동
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // 이벤트가 없을 때 기본 메시지 표시
  if (!events || events.length === 0) {
    return (
      <div className="mt-4 mb-6">
        <div className="relative w-full max-w-md overflow-hidden rounded-xl text-white">
          <div className="relative flex h-48 w-full items-center justify-center bg-gray-500">
            <p className="text-lg font-medium">진행중인 이벤트가 없습니다</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 mb-6">
      <div className="relative w-full max-w-md overflow-hidden rounded-xl text-white">
        {/* 슬라이더 컨테이너 */}
        <div className="relative h-48 w-full">
          {/* 배너 슬라이드들 */}
          <div className="h-full w-full">
            {events.map((event, index) => (
              <BannerSlide
                key={event.id}
                id={event.id}
                title={event.title}
                subtitle={event.subtitle}
                image={event.image}
                isActive={currentSlide === index}
              />
            ))}
          </div>
        </div>

        {/* 네비게이션 버튼 (이벤트가 2개 이상일 때만 표시) */}
        {totalSlides > 1 && (
          <BannerNavigation
            goToPrevSlide={goToPrevSlide}
            goToNextSlide={goToNextSlide}
          />
        )}

        {/* 인디케이터 점 (이벤트가 2개 이상일 때만 표시) */}
        {totalSlides > 1 && (
          <BannerIndicators
            totalSlides={totalSlides}
            currentSlide={currentSlide}
            goToSlide={goToSlide}
          />
        )}
      </div>
    </div>
  );
};

export default Banner;
