'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // 스크롤 위치에 따라 버튼 표시 여부 결정
  useEffect(() => {
    const toggleVisibility = () => {
      // 100px 이상 스크롤했을 때 버튼 표시
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', toggleVisibility);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // 상단으로 스크롤 함수
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // 버튼이 보이지 않을 때는 렌더링하지 않음
  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 flex size-12 items-center justify-center rounded-full bg-white/80 shadow-lg transition-all hover:bg-white hover:shadow-xl"
      aria-label="페이지 상단으로 이동"
    >
      <Image 
        src="/svg/arrow-up.svg" 
        alt="위로 가기" 
        width={24} 
        height={24}
        className="opacity-70"
      />
    </button>
  );
} 