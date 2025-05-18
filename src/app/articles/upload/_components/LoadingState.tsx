'use client';

import React, { useState, useEffect } from 'react';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';

export default function LoadingState() {
  const [isLoading, setIsLoading] = useState(true);
  
  // 로딩 상태 체크 로직
  useEffect(() => {
    // 개발 목적으로 로딩 시뮬레이션
    const checkLoading = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    checkLoading();
  }, []);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="flex h-[80vh] items-center justify-center">
      <p className="text-center text-lg">로딩 중...</p>
    </div>
  );
} 