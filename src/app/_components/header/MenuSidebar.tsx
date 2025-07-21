import React, { useState } from 'react';
import { CloseIcon } from '@/app/_components/icons';
import { MenuList } from '@/app/_components/lists/MenuList';

interface MenuSidebarProps {
  currentUserId?: string;
  isOwner?: boolean;
  isOpen?: boolean;
  onClose: () => void;
}

/**
 * 사이드바 형태의 메뉴 컴포넌트
 * 헤더의 햄버거 버튼 클릭 시 표시되는 슬라이드 메뉴
 */
export const MenuSidebar = ({
  currentUserId,
  isOpen,
  onClose
}: MenuSidebarProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* 오버레이 */}
      <div
        className="fixed inset-0 z-40 rounded-2xl bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 사이드바 */}
      <div className="fixed top-0 left-0 z-50 h-[90vh] w-72 transform rounded-xl bg-white shadow-xl transition-transform">
        <div className="p-4">
          {/* 메뉴 헤더 */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">메뉴</h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100"
              aria-label="메뉴 닫기">
              <CloseIcon
                size={20}
                className="text-gray-600"
              />
            </button>
          </div>

          {/* 사이드바 스타일의 메뉴 리스트 */}
          <MenuList
            variant="sidebar"
            onItemClick={onClose}
            currentUserId={currentUserId}
          />
        </div>
      </div>
    </>
  );
};
