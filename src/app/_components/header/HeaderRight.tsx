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
  contentAuthorId?: string; // 추가: 콘텐츠 작성자 ID
}

export const HeaderRight = ({
  showContentMenu,
  contentType,
  contentId,
  contentAuthorId
}: HeaderRightProps) => {
  const { user, isInitialized } = useAuthStore();

  // 소유권 확인 (store의 user id와 contentAuthorId 비교)
  const isOwner = contentAuthorId ? user?.id === contentAuthorId : false;

  // 관리자 권한 확인 (article, event는 관리자만)
  const isAdminContent = contentType === 'article' || contentType === 'event';
  const hasPermission = isAdminContent ? user?.role === 'ADMIN' : isOwner;

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
          className="absolute flex size-9 items-center justify-center rounded-xl bg-white/50 transition-all cursor-wait z-10"
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
          isOwner={hasPermission}
        />
      )}
    </div>
  );
};
