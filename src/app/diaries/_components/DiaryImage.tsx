'use client';

import React from 'react';
import Image from 'next/image';
import { ShareButton } from '@/app/_components/common/ShareButton';
import { get } from 'http';
import { getImageSrc } from '@/app/_utils/imageUtils';

interface DiaryImageProps {
  imageUrl: string | null;
  title: string;
  id: string;
  appBaseUrl?: string;
}

export default function DiaryImage({
  imageUrl,
  title,
  id,
  appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || ''
}: DiaryImageProps) {
  return (
    <div className="relative h-[calc(50vh-16px)] w-full bg-black/30">
      <Image
        src={imageUrl ? getImageSrc(imageUrl, "medium") : '/images/default-img.webp'}
        alt={title}
        fill
        className="object-cover"
        priority
        unoptimized
      />

      {/* 공유 버튼 */}
      <div className="absolute right-4 bottom-12 z-20">
        <ShareButton
          url={`${appBaseUrl}/diaries/${id}`}
          title={title}
        />
      </div>

      {/* 그라데이션 오버레이 추가 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
    </div>
  );
}
