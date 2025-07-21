'use client';

import React, { useEffect, useState } from 'react';
import { HeaderActions } from '@/app/_components/header/HeaderActions';
import { ContentService, ContentType } from '@/app/_services/contentService';
import { HeaderNotificationsWrapper } from './HeaderNotificationWrapper';

interface HeaderRightProps {
  showNotification: boolean;
  showContentMenu: boolean;
  contentType?: ContentType;
  contentId?: string;
}

export const HeaderRight = ({
  showNotification,
  showContentMenu,
  contentType,
  contentId
}: HeaderRightProps) => {
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPermission = async () => {
      if (showContentMenu && contentId && contentType) {
        try {
          const hasPermission = await ContentService.checkPermission(
            contentType,
            contentId
          );
          setIsOwner(hasPermission);
        } catch (error) {
          console.error('권한 확인 오류:', error);
          setIsOwner(false);
        }
      }
      setIsLoading(false);
    };

    checkPermission();
  }, [showContentMenu, contentId, contentType]);

  if (isLoading && showContentMenu) {
    return (
      <div className="ml-auto flex w-auto items-center justify-end gap-2">
        <div className="h-9 w-9 animate-pulse rounded-xl bg-white/30" />
      </div>
    );
  }

  return (
    <div className="ml-auto flex w-auto items-center justify-end gap-2">
      {/* 알림 버튼 */}
      {showNotification && <HeaderNotificationsWrapper />}

      {/* 콘텐츠 메뉴 버튼 */}
      {showContentMenu && contentId && contentType && (
        <HeaderActions
          contentType={contentType}
          id={contentId}
          isOwner={isOwner}
        />
      )}
    </div>
  );
};
