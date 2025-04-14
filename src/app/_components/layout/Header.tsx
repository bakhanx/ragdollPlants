'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { MenuList } from '../lists/MenuList';
import Image from 'next/image';
import { profileImg } from '../../_temp';
import Link from 'next/link';
import Notification from './Notification';

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
  variant?: 'default' | 'transparent' | 'glass';
  showNotification?: boolean;
  onNotificationClick?: () => void;
  showMenuButton?: boolean;
  onMenuClick?: () => void;
}

export default function Header({
  showBackButton = false,
  title = '랙돌플랜츠',
  variant = 'default',
  showNotification = false,
  onNotificationClick,
  showMenuButton = false,
  onMenuClick
}: HeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const variants = {
    default: 'w-full flex items-center gap-3 py-2',
    transparent: 'w-full flex items-center gap-3 py-3',
    glass:
      'w-full flex items-center gap-3 py-3 px-4 bg-white/20 backdrop-blur-sm rounded-xl shadow-sm'
  };

  const handleNotificationClick = () => {
    if (onNotificationClick) {
      onNotificationClick();
    } else {
      setIsNotificationOpen(true);
    }
  };

  return (
    <>
      <div className={variants[variant]}>
        {/* 왼쪽: 메뉴 버튼 또는 뒤로가기 */}
        <div className="w-10">
          {showBackButton ? (
            <button
              onClick={() => router.back()}
              className="group flex size-9 items-center justify-center rounded-xl bg-white/50 transition-all hover:bg-white/70 hover:shadow-md"
              aria-label="뒤로 가기">
              <svg
                className="h-5 w-5 text-gray-700 transition-transform group-hover:-translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => setIsMenuOpen(true)}
              className="group flex size-9 items-center justify-center rounded-xl bg-white/50 transition-all hover:bg-white/70 hover:shadow-md"
              aria-label="메뉴 열기">
              <svg
                className="h-5 w-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}
        </div>

        {/* 중앙: 타이틀 */}
        <div className="flex flex-1 items-center justify-center">
          <Link
            href="/"
            className="flex items-center gap-x-2">
            <div className="relative size-8">
              <Image
                className="rounded-full"
                alt="Logo"
                src={profileImg}
                style={{ objectFit: 'cover' }}
                fill
              />
            </div>
            <h1 className="text-lg leading-tight font-semibold text-gray-100 ">
              {title}
            </h1>
          </Link>
        </div>

        {/* 오른쪽: 알림 또는 메뉴 버튼 */}
        <div className="flex w-10 justify-end">
          {showNotification && !showMenuButton && (
            <button
              onClick={handleNotificationClick}
              className="group relative flex size-9 items-center justify-center rounded-xl bg-white/50 transition-all hover:bg-white/70 hover:shadow-md"
              aria-label="알림">
              <svg
                className="h-5 w-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                2
              </span>
            </button>
          )}
          
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="group relative flex size-9 items-center justify-center rounded-xl bg-white/50 transition-all hover:bg-white/70 hover:shadow-md"
              aria-label="메뉴 열기">
              <svg
                className="h-5 w-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 메뉴 사이드바 */}
      {isMenuOpen && (
        <>
          {/* 오버레이 */}
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm rounded-2xl"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* 사이드바 */}
          <div className="fixed top-0 left-0 z-50 h-[90vh] w-72 transform bg-white shadow-xl transition-transform rounded-xl">
            <div className="p-4">
              {/* 메뉴 헤더 */}
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">메뉴</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-full p-2 hover:bg-gray-100"
                  aria-label="메뉴 닫기">
                  <svg
                    className="h-5 w-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* 사이드바 스타일의 메뉴 리스트 */}
              <MenuList
                variant="sidebar"
                onItemClick={() => setIsMenuOpen(false)}
              />
            </div>
          </div>
        </>
      )}

      {/* 알림 패널 */}
      <Notification 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
      />
    </>
  );
}
