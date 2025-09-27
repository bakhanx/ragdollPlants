'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type BannerSlideProps = {
  id: string | number;
  title: string;
  subtitle: string;
  image: string;
  isActive: boolean;
};

export const BannerSlide: React.FC<BannerSlideProps> = ({
  id,
  title,
  subtitle,
  image,
  isActive
}) => {
  return (
    <Link
      href={`/events/${id}`}
      className="absolute top-0 left-0 h-full w-full transition-opacity duration-500"
      style={{
        opacity: isActive ? 1 : 0,
        zIndex: isActive ? 10 : 0,
        pointerEvents: isActive ? 'auto' : 'none'
      }}>
      {/* 배경 이미지 */}
      <div className="relative h-full w-full">
        <Image
          src={`${image}/medium`}
          alt={title}
          fill
          style={{ objectFit: 'cover' }}
          className="rounded-xl"
          priority
          unoptimized
        />
        {/* 어두운 오버레이 */}
        <div className="absolute inset-0 rounded-xl bg-black opacity-30" />
      </div>

      {/* 텍스트 내용 */}
      <div className="absolute bottom-4 left-4 z-20">
        <p className="text-xs sm:text-sm">{subtitle}</p>
        <h2 className="text-lg leading-snug font-medium sm:text-xl">{title}</h2>
      </div>
    </Link>
  );
};

export default BannerSlide;
