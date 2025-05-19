import React from 'react';
import { ImageUploader } from '@/app/_components/common/ImageUploader';

export interface ImageUploadSectionProps {
  imagePreview: string | null;
  onImageChange: (file: File | null) => void;
}

export const ImageUploadSection = ({ imagePreview, onImageChange }: ImageUploadSectionProps) => {
  return (
    <ImageUploader
      imagePreview={imagePreview}
      onImageChange={onImageChange}
      label="이벤트 이미지"
      required={true}
      aspectRatio="landscape"
      placeholder="클릭하여 이미지 업로드"
      infoText="JPG, PNG, WebP 형식 (최대 5MB)"
    />
  );
}; 