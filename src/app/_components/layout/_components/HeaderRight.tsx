'use client';

import React from 'react';
import { BellIcon } from '../../icons';
import ContentMenu from '../../common/ContentMenu';

interface HeaderRightProps {
  showNotification: boolean;
  onNotificationClick: () => void;
  showMenuButton: boolean;
  contentType: 'article' | 'diary' | 'event';
  id: string;
}

/**
 * 헤더의 오른쪽 섹션 컴포넌트
 * 알림과 콘텐츠 메뉴 버튼을 표시
 */
export default function HeaderRight({
  showNotification,
  onNotificationClick,
  showMenuButton,
  contentType,
  id
}: HeaderRightProps) {
  return (
    <div className="ml-auto flex w-auto items-center justify-end gap-2">
      {/* 알림 버튼 */}
      {showNotification && (
        <button
          onClick={onNotificationClick}
          className="group relative flex size-9 items-center justify-center rounded-xl bg-white/50 transition-all hover:bg-white/70 hover:shadow-md"
          aria-label="알림">
          <BellIcon
            size={20}
            className="[&>path]:stroke-gray-700"
          />
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            2
          </span>
        </button>
      )}

      {/* 메뉴 버튼 또는 커스텀 메뉴 컴포넌트 */}
      {showMenuButton && (
        <ContentMenu
          contentType={contentType}
          id={id}
        />
      )}
    </div>
  );
} 