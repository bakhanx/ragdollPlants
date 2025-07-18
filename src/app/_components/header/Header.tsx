'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Notification } from './Notification';
import { MenuSidebar } from './MenuSidebar';
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
  onNotificationClick?: () => void;
  showMenuButton?: boolean;
  onBackClick?: () => void;
  showContentMenu?: boolean;
  isOwner?: boolean;
}

// 스타일 변형에 대한 클래스 매핑
const variantClasses: Record<HeaderVariant, string> = {
  default: 'w-full flex items-center gap-3',
  transparent: 'w-full flex items-center gap-3',
  glass:
    'fixed z-10 flex w-full items-center justify-between rounded-t-xl bg-black/20 px-4 py-4 shadow-lg backdrop-blur-sm'
};

export const Header = ({
  id = '1',
  showBack = false,
  title = '랙돌플랜츠',
  variant = 'default',
  contentType = 'article',
  showNotification = false,
  onNotificationClick,
  showMenuButton = false,
  onBackClick,
  showContentMenu = false,
  isOwner = false
}: HeaderProps) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // 알림 버튼 핸들러
  const handleNotificationClick = () => {
    if (onNotificationClick) {
      onNotificationClick();
    } else {
      setIsNotificationOpen(true);
    }
  };

  // 뒤로가기 버튼 핸들러
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  return (
    <>
      <div className={variantClasses[variant]}>
        {/* 왼쪽: 메뉴 버튼 또는 뒤로가기 */}
        <HeaderLeft
          showBack={showBack}
          onBackClick={handleBackClick}
          onMenuOpen={() => setIsMenuOpen(true)}
        />

        {/* 중앙: 타이틀 - 절대 위치로 중앙 배치 */}
        <HeaderCenter
          title={title}
          logoSrc={'/images/Profile.webp'}
        />

        {/* 오른쪽: 알림, 메뉴 버튼 */}
        <HeaderRight
          showNotification={showNotification}
          onNotificationClick={handleNotificationClick}
          showContentMenu={showContentMenu}
          contentType={contentType}
          id={id}
          isOwner={isOwner}
        />
      </div>

      {/* 메뉴 사이드바 패널 */}
      <MenuSidebar
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      {/* 알림 패널 */}
      <Notification
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </>
  );
};
