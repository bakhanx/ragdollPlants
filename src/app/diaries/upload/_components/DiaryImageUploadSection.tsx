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
            (현재 {maxPhotoCount}장 지원, 추후 3장 예정)
          </span>
        </label>
      </div>

      <div className="mb-3">
        {/* 이미지 슬롯 그리드 */}
        <div className="mb-3 grid grid-cols-3 gap-2">
          {/* 첫 번째 슬롯 */}
          {Array.from({ length: maxPhotoCount }).map((_, index) => {
            const hasImage =
              index < imagePreviews.length && !!imagePreviews[index];
            const isNextSlot = index === imagePreviews.length;

            return (
              <ImageUploader
                key={index}
                imagePreview={hasImage ? imagePreviews[index] : null}
                onImageChange={file => handleMultiImageChange(file, index)}
                multiMode={true}
                index={index}
                isAddButton={isNextSlot}
                aspectRatio="square"
                showRemoveButton={hasImage}
                className="text-xs"
              />
            );
          })}

          {/* 추후 업데이트 예정 슬롯들 */}
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={`coming-soon-${index}`}
              className="bg flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-400 bg-gray-400 text-center">
              <div className="text-sm text-gray-200">
                <div className="">업데이트 예정</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
