'use client';

import React, { Suspense } from 'react';
import { HeaderLeft } from './HeaderLeft';
import { HeaderCenter } from './HeaderCenter';
import { HeaderRight } from './HeaderRight';
import { ContentType } from '@/app/_services/contentService';

// 헤더 변형 타입
type HeaderVariant = 'default' | 'transparent' | 'glass';

// 헤더 속성 인터페이스
interface HeaderProps {
  id?: string;
  showBack?: boolean;
  title?: string;
  variant?: HeaderVariant;
  contentType?: ContentType;
  showNotification?: boolean;
  showMenuButton?: boolean;
  showContentMenu?: boolean;
}

// 스타일 변형에 대한 클래스 매핑
const variantClasses: Record<HeaderVariant, string> = {
  default: 'w-full flex items-center gap-3',
  transparent: 'w-full flex items-center gap-3',
  glass:
    'fixed z-10 flex w-full items-center justify-between rounded-t-xl bg-black/20 px-4 py-4 shadow-lg backdrop-blur-sm'
};

export const Header = ({
  id,
  showBack = false,
  title = '랙돌플랜츠',
  variant = 'default',
  contentType,
  showNotification = false,
  showContentMenu = false
}: HeaderProps) => {
  return (
    <>
      <div className={variantClasses[variant]}>
        {/* 왼쪽: 메뉴 버튼 또는 뒤로가기 */}
        <HeaderLeft showBack={showBack} />

        {/* 중앙: 타이틀 - 절대 위치로 중앙 배치 */}
        <HeaderCenter
          title={title}
          logoSrc={'/images/Profile.webp'}
        />

        {/* 오른쪽: 알림, 메뉴 버튼 */}
        <Suspense
          fallback={
            <div className="h-9 w-9 animate-pulse rounded-xl bg-white/30" />
          }>
          <HeaderRight
            showNotification={showNotification}
            showContentMenu={showContentMenu}
            contentType={contentType}
            contentId={id}
          />
        </Suspense>
      </div>
    </>
  );
};
