'use client';

import React from 'react';
import { BellIcon } from '@/app/_components/icons';
import { ContentMenu } from '@/app/_components/common/ContentMenu';
import { useContentActions } from '@/app/_hooks/useContentActions';
import { ContentType } from '@/app/_services/contentService';

interface HeaderRightProps {
  showNotification: boolean;
  onNotificationClick: () => void;
  showContentMenu: boolean;
  contentType: ContentType;
  id: string;
  isOwner?: boolean;
}

/**
 * 헤더의 오른쪽 섹션 컴포넌트
 * 알림과 콘텐츠 메뉴 버튼
 */
export const HeaderRight = ({
  showNotification,
  onNotificationClick,
  showContentMenu,
  contentType,
  id,
  isOwner = false
}: HeaderRightProps) => {
  const { handleEdit, handleDelete } = useContentActions(contentType, id);

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

      {/* 콘텐츠 메뉴 버튼 */}
      {showContentMenu && (
        <ContentMenu
          contentType={contentType}
          id={id}
          isOwner={isOwner}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};
