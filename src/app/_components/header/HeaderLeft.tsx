'use client';

import React, { useState } from 'react';
import { BackIcon, HamburgerIcon } from '@/app/_components/icons';
import { useRouter } from 'next/navigation';
import { MenuList } from '../lists/MenuList';
import { MenuSidebar } from './MenuSidebar';

interface HeaderLeftProps {
  showBack?: boolean;
}

export const HeaderLeft = ({ showBack }: HeaderLeftProps) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleBackClick = () => {
    router.back();
  };

  const handleOpenMenu = () => {
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="w-10">
      <MenuSidebar
        isOpen={isMenuOpen}
        onClose={handleCloseMenu}
      />
      {showBack ? (
        <button
          onClick={handleBackClick}
          className="group flex size-9 items-center justify-center rounded-xl bg-white/50 transition-all hover:bg-white/70 hover:shadow-md"
          aria-label="뒤로 가기">
          <BackIcon
            size={20}
            className="[&>path]:stroke-gray-700"
          />
        </button>
      ) : (
        <button
          onClick={handleOpenMenu}
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
};
