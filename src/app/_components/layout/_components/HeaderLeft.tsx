'use client';

import React from 'react';
import { BackIcon, HamburgerIcon } from '../../icons';

interface HeaderLeftProps {
  showBack: boolean;
  onBackClick: () => void;
  onMenuOpen: () => void;
}

export default function HeaderLeft({
  showBack,
  onBackClick,
  onMenuOpen
}: HeaderLeftProps) {
  return (
    <div className="w-10">
      {showBack ? (
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
