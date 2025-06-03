'use client';

import React from 'react';
import Image from 'next/image';
import { ShareButton } from '@/app/_components/common/ShareButton';

interface DiaryImageProps {
  imageUrl: string;
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
    <div className="relative h-[calc(50vh-16px)] w-full">
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority
      />
      
      {/* 공유 버튼 */}
      <div className="absolute z-20 bottom-12 right-4">
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