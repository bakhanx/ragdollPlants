'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShareButton } from '../../../_components/common/ShareButton';
import { getImageSrc } from '@/app/_utils/imageUtils';
import { GRAY_PLACEHOLDER } from '@/app/_constants/imagePlaceholders';

interface EventHeaderImageProps {
  imageUrl: string;
  title: string;
  isEnded: boolean;
  isEarlyTerminated?: boolean;
  eventId: string;
}

export const EventHeaderImage = ({
  imageUrl,
  title,
  isEnded,
  isEarlyTerminated = false,
  eventId
}: EventHeaderImageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative mb-4 h-96 w-full overflow-hidden rounded-xl">
      <Image
        src={
          imageUrl ? getImageSrc(imageUrl, 'large') : '/images/default-img.webp'
        }
        alt={title}
        fill
        style={{ objectFit: 'cover' }}
        className={`${isEnded ? 'grayscale' : ''} transition-opacity duration-500`}
        blurDataURL={`${imageUrl}/small`}
        placeholder="blur"
        priority
        unoptimized
        onLoadingComplete={() => setIsLoading(false)}
      />

      {!isEnded && (
        <div className="absolute right-2 bottom-2 z-20">
          <ShareButton
            url={`${process.env.NEXT_PUBLIC_APP_URL}/events/${eventId}`}
            title={title}
          />
        </div>
      )}

      {/* 오버레이 */}
      {/* <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" /> */}

      {/* 종료된 이벤트 표시 */}
      {isEnded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-md bg-gray-500 px-4 py-2">
            <span className="text-lg font-bold text-white">
              {isEarlyTerminated ? '조기종료된 이벤트' : '종료된 이벤트'}
            </span>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 -z-10 animate-pulse rounded-xl bg-gray-300" />
      )}

    </div>
  );
};
