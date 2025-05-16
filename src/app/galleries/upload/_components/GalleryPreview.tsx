'use client';

import React from 'react';
import { ImageUploader } from '@/app/_components/common/ImageUploader';

interface GalleryPreviewProps {
  imagePreview: string | null;
  title: string;
  showOverlay: boolean;
  handleImageChange: (file: File | null) => void;
}

export default function GalleryPreview({
  imagePreview,
  title,
  showOverlay,
  handleImageChange
}: GalleryPreviewProps) {
  return (
    <div className="mb-8 relative">
      <ImageUploader 
        imagePreview={imagePreview}
        onImageChange={handleImageChange}
        aspectRatio="square"
        label=""
        placeholder="이미지를 업로드하세요"
        infoText="고품질 이미지를 권장합니다"
        className="shadow-lg transition-all duration-500 hover:shadow-xl"
      />
      
      {/* 오버레이 및 정보 - 프리뷰 (이미지가 있고 오버레이가 활성화된 경우만 표시) */}
      {imagePreview && showOverlay && (
        <div className="absolute inset-0 top-2 rounded-lg bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
          <div className="absolute bottom-0 w-full p-4 text-white">
            <h3 className="mb-1 text-lg font-semibold">
              {title || '제목을 입력해주세요'}
            </h3>
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
  );
} 