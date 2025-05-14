'use client';

import React from 'react';

interface GalleryUsage {
  used: number;
  remaining: number;
}

interface GalleryTitleSectionProps {
  showOverlay: boolean;
  toggleOverlay: (e: React.MouseEvent) => void;
  imagePreview: string | null;
  galleryUsage: GalleryUsage;
  maxPhotos: number;
}

export default function GalleryTitleSection({
  showOverlay,
  toggleOverlay,
  imagePreview,
  galleryUsage,
  maxPhotos
}: GalleryTitleSectionProps) {
  return (
    <div className="mt-16 p-4 text-center text-white">
      <h1 className="mb-1 text-3xl font-bold">새 갤러리 추가</h1>
      <p className="mb-8 text-sm opacity-80">
        소중한 식물의 아름다운 순간을 공유하세요
      </p>
      <div className="mx-auto mb-8 h-px w-16 bg-white opacity-30"></div>
      <div className="flex items-center justify-between gap-2">
        {imagePreview && (
          <button
            type="button"
            onClick={toggleOverlay}
            className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
              showOverlay
                ? 'bg-green-500 text-white'
                : 'bg-gray-300 text-gray-200'
            }`}>
            {showOverlay ? '오버레이 ON' : '오버레이 OFF'}
          </button>
        )}
        <p className="text-xs opacity-60">
          {galleryUsage.used}/{maxPhotos} 등록됨
        </p>
      </div>
    </div>
  );
} 