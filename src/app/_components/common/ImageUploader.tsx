'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { ImageIcon, CloseIcon } from '@/app/_components/icons/Icons';

type ImageUploaderProps = {
  // 기본 설정
  imagePreview: string | null;
  onImageChange: (file: File | null) => void;
  height?: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  infoText?: string;
  optionalText?: string;
  className?: string;
  aspectRatio?: 'square' | 'landscape' | 'portrait';
  showRemoveButton?: boolean;
  allowTypes?: string;

  // 다중 이미지 모드 설정
  multiMode?: boolean;
  index?: number;
  isAddButton?: boolean;
};

export const ImageUploader = ({
  // 기본 설정
  imagePreview,
  onImageChange,
  height,
  label = '이미지',
  required = false,
  placeholder = '클릭하여 이미지 업로드',
  infoText = 'JPG, PNG, WebP 형식 (최대 5MB)',
  optionalText = '',
  className = '',
  aspectRatio = 'square',
  showRemoveButton = true,
  allowTypes = 'image/*',

  // 다중 이미지 모드 설정
  multiMode = false,
  index = 0,
  isAddButton = true
}: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지 선택 영역 클릭 핸들러
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // 이미지 변경 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 부모 컴포넌트에 파일 전달 (실제 유효성 검사는 훅에서 처리)
    onImageChange(file);
  };

  // 이미지 삭제 핸들러
  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    onImageChange(null);

    // 파일 입력 필드 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 화면비에 따른 클래스 설정
  const aspectRatioClass = {
    square: 'aspect-square',
    landscape: 'aspect-video',
    portrait: 'aspect-[3/4]'
  }[aspectRatio];

  // height를 설정할지 aspectRatio를 설정할지 결정
  const sizeClass = height || aspectRatioClass;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* 다중 모드가 아닐 때만 라벨 표시 */}
      {!multiMode && label && (
        <label className="block text-sm font-medium text-gray-50">
          {label} {required && <span className="text-red-500">*</span>}
          {!required && (
            <span className="ml-1 text-xs text-gray-400">{optionalText}</span>
          )}
        </label>
      )}

      <div
        onClick={handleImageClick}
        className={`relative w-full cursor-pointer overflow-hidden rounded-lg border-2 border-dashed border-gray-300 ${sizeClass}`}>
        {imagePreview ? (
          <>
            <Image
              src={imagePreview}
              alt="이미지 미리보기"
              fill
              className="object-cover"
            />
            {showRemoveButton && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className={`bg-opacity-50 hover:bg-opacity-70 absolute top-2 right-2 z-10 flex items-center justify-center rounded-full bg-red-500 text-white ${multiMode ? 'size-6' : 'size-8'}`}>
                <CloseIcon
                  size={multiMode ? 14 : 18}
                  className="[&_path]:stroke-white"
                />
              </button>
            )}
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-2 text-center">
            {isAddButton ? (
              <>
                <ImageIcon
                  size={multiMode ? 24 : 32}
                  className="mb-1 [&_path]:stroke-gray-200"
                />
                <p
                  className={`${multiMode ? 'text-[11px]' : 'text-sm'} text-gray-200`}>
                  {placeholder}
                </p>
                <p
                  className={`${multiMode ? 'text-[10px]' : 'text-xs'} mt-1 text-gray-200`}>
                  {infoText}
                </p>
              </>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept={allowTypes}
        className="hidden"
      />
    </div>
  );
};

