'use client';

import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";

// 배너 데이터 타입 정의
export type BannerItem = {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
};

// 샘플 배너 데이터
const bannerItems: BannerItem[] = [
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

export const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = bannerItems.length;

  // 자동 슬라이드 기능
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000); // 5초마다 슬라이드 변경

    return () => clearInterval(interval);
  }, [totalSlides]);

  // 이전 슬라이드로 이동
  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  // 다음 슬라이드로 이동
  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  // 특정 슬라이드로 직접 이동
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="mb-6 mt-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-xl text-white">
        {/* 슬라이더 컨테이너 */}
        <div className="relative h-48 w-full">
          {/* 배너 슬라이드들 */}
          <div className="h-full w-full">
            {bannerItems.map((banner, index) => (
              <Link 
                key={banner.id} 
                href={banner.link}
                className="absolute left-0 top-0 h-full w-full transition-opacity duration-500"
                style={{ 
                  opacity: currentSlide === index ? 1 : 0,
                  zIndex: currentSlide === index ? 10 : 0,
                  pointerEvents: currentSlide === index ? 'auto' : 'none'
                }}
              >
                {/* 배경 이미지 */}
                <div className="relative h-full w-full">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-xl"
                    priority
                  />
                  {/* 어두운 오버레이 */}
                  <div className="absolute inset-0 bg-black opacity-30 rounded-xl" />
                </div>

                {/* 텍스트 내용 */}
                <div className="absolute bottom-4 left-4 z-20">
                  <p className="text-xs sm:text-sm">{banner.subtitle}</p>
                  <h2 className="text-lg font-medium leading-snug sm:text-xl">
                    {banner.title}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 네비게이션 버튼 - 이전/다음 */}
        <button
          onClick={goToPrevSlide}
          className="absolute left-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white transition-colors hover:bg-black/50"
          aria-label="이전 배너"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={goToNextSlide}
          className="absolute right-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white transition-colors hover:bg-black/50"
          aria-label="다음 배너"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* 인디케이터 점 */}
        <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 space-x-2">
          {bannerItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 w-2 rounded-full transition-colors ${
                currentSlide === index ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`배너 ${index + 1}번으로 이동`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
