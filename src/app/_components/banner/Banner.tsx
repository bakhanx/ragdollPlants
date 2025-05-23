'use client';

import React, { useState, useEffect } from 'react';
import { bannerItems } from '@/app/_constants/eventData';
import BannerSlide from './BannerSlide';
import BannerNavigation from './BannerNavigation';
import BannerIndicators from './BannerIndicators';

export const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = bannerItems.length;

  // 자동 슬라이드 기능
  useEffect(() => {
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

  return (
    <div className="mt-4 mb-6">
      <div className="relative w-full max-w-md overflow-hidden rounded-xl text-white">
        {/* 슬라이더 컨테이너 */}
        <div className="relative h-48 w-full">
          {/* 배너 슬라이드들 */}
          <div className="h-full w-full">
            {bannerItems.map((banner, index) => (
              <BannerSlide
                key={banner.id}
                id={banner.id}
                title={banner.title}
                subtitle={banner.subtitle}
                imageUrl={banner.imageUrl}
                link={banner.link}
                isActive={currentSlide === index}
              />
            ))}
          </div>
        </div>

        {/* 네비게이션 버튼 */}
        <BannerNavigation
          goToPrevSlide={goToPrevSlide}
          goToNextSlide={goToNextSlide}
        />

        {/* 인디케이터 점 */}
        <BannerIndicators
          totalSlides={totalSlides}
          currentSlide={currentSlide}
          goToSlide={goToSlide}
        />
      </div>
    </div>
  );
};

export default Banner;
