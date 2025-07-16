'use server';

import React from 'react';
import { HeaderActions } from '@/app/_components/header/HeaderActions';
import { ContentService, ContentType } from '@/app/_services/contentService';
import { HeaderNotifications } from './HeaderNotifications';

interface HeaderRightProps {
  showNotification: boolean;
  showContentMenu: boolean;
  contentType?: ContentType;
  contentId?: string;
  authorId?: string;
}

/**
 * 헤더의 오른쪽 섹션 컴포넌트
 * 알림과 콘텐츠 메뉴 버튼
 */
export const HeaderRight = async ({
  showNotification,
  showContentMenu,
  contentType,
  contentId
}: HeaderRightProps) => {
  let isOwner = false;
  if (showContentMenu && contentId && contentType) {
    isOwner = await ContentService.checkPermission(contentType, contentId);
  }

  return (
    <div className="ml-auto flex w-auto items-center justify-end gap-2">
      {/* 알림 버튼 */}
      {showNotification && (
        <HeaderNotifications showNotification={showNotification} />
      )}

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
