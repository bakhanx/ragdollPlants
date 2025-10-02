import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeaderCenterProps {
  logoSrc: string;
}

/**
 * 헤더의 중앙 섹션 컴포넌트
 * 로고와 타이틀을 표시
 */
export const HeaderCenter = ({ logoSrc }: HeaderCenterProps) => {
  return (
    <div className="pointer-events-none absolute right-0 left-0 mx-auto flex items-center justify-center">
      <Link
        href="/"
        className="pointer-events-auto max-w-[45%] items-center gap-x-2 sm:max-w-[50%]">
        <span className="flex items-center gap-x-1 truncate text-lg leading-tight font-semibold text-gray-100">
          <span>Ragdoll</span>
          <div className="size-8 flex-shrink-0">
            <Image
              className="rounded-full"
              alt="Logo"
              src={`${logoSrc}`}
              style={{ objectFit: 'cover' }}
              width={32}
              height={32}
            />
          </div>
          <span>Plants</span> <span> </span>
        </span>
      </Link>
    </div>
  );
};
