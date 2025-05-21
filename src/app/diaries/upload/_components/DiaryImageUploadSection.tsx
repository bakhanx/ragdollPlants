'use client';

import React from 'react';
import { ImageUploader } from '@/app/_components/common/ImageUploader';
import { useRouter } from 'next/navigation';

interface DiaryImageUploadSectionProps {
  isPaidUser: boolean;
  maxPhotoCount: number;
  photoLimit: {
    used: number;
    remaining: number;
    canAddPhotos: boolean;
  };
  imagePreviews: string[];
  handleMultiImageChange: (file: File | null, index: number) => void;
}

export const DiaryImageUploadSection = ({
  isPaidUser,
  maxPhotoCount,
  photoLimit,
  imagePreviews,
  handleMultiImageChange
}: DiaryImageUploadSectionProps) => {
  const router = useRouter();
  const MAX_FREE_PHOTO_DIARIES = 3;

  // 구독 페이지로 이동
  const handleUpgradeClick = () => {
    router.push('/subscription');
  };

  return (
    <div className="pt-2">
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-50">
          사진 첨부
          <span className="ml-1 text-xs text-gray-400">
            {isPaidUser
              ? `(최대 ${maxPhotoCount}장)`
              : `(${imagePreviews.length}/${MAX_FREE_PHOTO_DIARIES}장)`}
          </span>
        </label>
        {!isPaidUser && photoLimit.used >= MAX_FREE_PHOTO_DIARIES && (
          <span
            className="cursor-pointer text-xs text-blue-500"
            onClick={handleUpgradeClick}>
            구독하고 더 많은 사진 추가하기
          </span>
        )}
      </div>

      {photoLimit.canAddPhotos ? (
        <div className="mb-3">
          {!isPaidUser && (
            <p className="mb-2 text-xs text-gray-200">
              무료 회원은 최대 {MAX_FREE_PHOTO_DIARIES}개의 일기에만
              사진을 첨부할 수 있습니다.
              <br />
              현재 {photoLimit.used}개 사용 / {photoLimit.remaining}개
              남음
            </p>
          )}

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
      ) : (
        <div className="bg-opacity-20 mb-3 rounded-lg bg-gray-700 p-3 text-center">
          <p className="mb-2 text-sm text-gray-200">
            무료 사진 첨부 일기를 모두 사용했습니다.
          </p>
          <button
            type="button"
            onClick={handleUpgradeClick}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">
            구독 플랜 보기
          </button>
        </div>
      )}
    </div>
  );
}; 