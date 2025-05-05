import React from 'react';
import Image from 'next/image';
import { ShareButton } from './ShareButton';

interface ShareableImageProps {
  src: string;
  alt: string;
  id: string;
  title: string;
  height?: string;
  showShare?: boolean;
  isGrayscale?: boolean;
  overlay?: boolean;
  contentType: 'article' | 'event' | 'plant';
  priority?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function ShareableImage({
  src,
  alt,
  id,
  title,
  height = 'h-48',
  showShare = true,
  isGrayscale = false,
  overlay = true,
  contentType,
  priority = false,
  className = '',
  children
}: ShareableImageProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const url = `${baseUrl}/${contentType}s/${id}`;

  return (
    <div className={`relative ${height} w-full overflow-hidden rounded-lg ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover ${isGrayscale ? 'grayscale' : ''}`}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
      />

      {showShare && (
        <div className="absolute right-2 bottom-2 z-20">
          <ShareButton url={url} title={title} />
        </div>
      )}

      {/* 그라데이션 오버레이 */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      )}

      {children}
    </div>
  );
} 