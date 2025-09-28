'use client';

import React from 'react';
import { HeaderActions } from '@/app/_components/header/HeaderActions';
import { ContentType } from '@/app/_services/contentService';
import { HeaderNotificationsWrapper } from './HeaderNotificationWrapper';
import { useAuthStore } from '@/stores/authStore';
import { LoginButton } from './LoginButton';
import { BellIcon } from '../icons';

interface HeaderRightProps {
  showContentMenu: boolean;
  contentType?: ContentType;
  contentId?: string;
}

export const HeaderRight = ({
  showContentMenu,
  contentType,
  contentId
}: HeaderRightProps) => {
  const { user, isInitialized } = useAuthStore();

  return (
    <div className="ml-auto flex w-auto items-center justify-end gap-2">
      {!user && isInitialized && (
        <div className="ml-auto flex w-auto items-center justify-end gap-2">
          <LoginButton />
        </div>
      )}
      {/* 알림 버튼 - 로그인한 사용자라면 항상 표시 */}

      {!isInitialized && (
        <div
          className="absolute z-10 flex size-9 cursor-wait items-center justify-center rounded-xl bg-white/50 transition-all"
          aria-label="알림">
          <BellIcon
            size={20}
            className="[&>path]:stroke-gray-700"
          />
        </div>
      )}

      {user && <HeaderNotificationsWrapper />}

      {/* 콘텐츠 메뉴 버튼 - 권한이 있는 경우만 */}
      {showContentMenu && contentId && contentType && (
        <HeaderActions
          contentType={contentType}
          id={contentId}
          isOwner={showContentMenu}
        />
      )}
    </div>
  );
};
