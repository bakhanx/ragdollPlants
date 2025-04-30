'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeaderCenterProps {
  title: string;
  logoSrc: string;
}

/**
 * 헤더의 중앙 섹션 컴포넌트
 * 로고와 타이틀을 표시
 */
export const HeaderCenter = ({ title, logoSrc }: HeaderCenterProps) => {
  return (
    <div className="pointer-events-none absolute right-0 left-0 mx-auto flex items-center justify-center">
      <Link
        href="/"
        className="pointer-events-auto flex max-w-[45%] items-center gap-x-2 sm:max-w-[50%]">
        <div className="relative size-8 flex-shrink-0">
          <Image
            className="rounded-full"
            alt="Logo"
            src={logoSrc}
            style={{ objectFit: 'cover' }}
            fill
          />
        </div>
        <h1 className="truncate text-lg leading-tight font-semibold text-gray-100">
          {title}
        </h1>
      </Link>
    </div>
  );
} 