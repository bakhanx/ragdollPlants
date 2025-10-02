'use client';

import React from 'react';
import { ImageUploader } from '@/app/_components/common/ImageUploader';

interface GalleryPreviewProps {
  imagePreview: string | null;
  title: string;
  description: string;
  showOverlay: boolean;
  handleImageChange: (file: File | null) => void;
}

export default function GalleryPreview({
  imagePreview,
  title,
  description,
  showOverlay,
  handleImageChange
}: GalleryPreviewProps) {
  return (
    <>
      <div className="relative">
        <ImageUploader
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
          aspectRatio="square"
          label=""
          placeholder="이미지를 업로드하세요"
          infoText="고품질 이미지를 권장합니다"
          className="shadow-lg transition-all duration-500 hover:shadow-xl"
        />

        {/* 오버레이 및 정보 */}
        {imagePreview && showOverlay && (
          <div className="pointer-events-none absolute inset-0 top-2 rounded-lg bg-gradient-to-t from-black/50 via-transparent to-transparent">
            <div className="absolute bottom-0 w-full p-4 text-white">
              <h3 className="mb-1 text-lg font-semibold">
                {title || '제목을 입력해주세요'}
              </h3>
              {/* 설명 표시 */}
              {description && (
                <p className="mb-2 line-clamp-2 text-sm leading-relaxed opacity-90">
                  {description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs opacity-80">
                  {new Date().toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <span className="text-xs text-gray-300">
        🐈갤러리에 등록 후 차이가 있을 수 있습니다.
      </span>
    </>
  );
}
