'use client';

import React from 'react';
import { ImageUploader } from '@/app/_components/common/ImageUploader';

interface DiaryImageUploadSectionProps {
  maxPhotoCount: number;
  imagePreviews: string[];
  handleMultiImageChange: (file: File | null, index: number) => void;
}

export const DiaryImageUploadSection = ({
  maxPhotoCount,
  imagePreviews,
  handleMultiImageChange
}: DiaryImageUploadSectionProps) => {
  return (
    <div className="pt-2">
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-50">
          사진 첨부
          <span className="ml-1 text-xs text-gray-300">
            (최대 {maxPhotoCount}장)
          </span>
        </label>
      </div>

      <div className="mb-3">
        {/* 이미지 슬롯 그리드 - ImageUploader 사용 */}
        <div className="mb-3 grid grid-cols-3 gap-2">
          {Array.from({ length: maxPhotoCount }).map((_, index) => {
            const hasImage =
              index < imagePreviews.length && !!imagePreviews[index];
            const isNextSlot = index === imagePreviews.length;

            return (
              <ImageUploader
                key={index}
                imagePreview={hasImage ? imagePreviews[index] : null}
                onImageChange={file =>
                  handleMultiImageChange(file, index)
                }
                multiMode={true}
                index={index}
                isAddButton={isNextSlot}
                aspectRatio="square"
                showRemoveButton={hasImage}
                className="text-xs"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}; 