'use client';

import React from 'react';
import { BackIcon, HamburgerIcon } from '../../icons';

interface HeaderLeftProps {
  showBackButton: boolean;
  onBackClick: () => void;
  onMenuOpen: () => void;
}

/**
 * 헤더의 왼쪽 섹션 컴포넌트
 * 뒤로가기 버튼 또는 메뉴 버튼이 위치
 */
export default function HeaderLeft({
  showBackButton,
  onBackClick,
  onMenuOpen
}: HeaderLeftProps) {
  return (
    <div className="w-10">
      {showBackButton ? (
        <button
          onClick={onBackClick}
          className="group flex size-9 items-center justify-center rounded-xl bg-white/50 transition-all hover:bg-white/70 hover:shadow-md"
          aria-label="뒤로 가기">
          <BackIcon
            size={20}
            className="[&>path]:stroke-gray-700"
          />
        </button>
      ) : (
        <button
          onClick={onMenuOpen}
          className="group flex size-9 items-center justify-center rounded-xl bg-white/50 transition-all hover:bg-white/70 hover:shadow-md"
          aria-label="네비게이션 메뉴 열기">
          <HamburgerIcon
            size={20}
            className="[&>path]:stroke-gray-700"
          />
        </button>
      )}
    </div>
  );
} 