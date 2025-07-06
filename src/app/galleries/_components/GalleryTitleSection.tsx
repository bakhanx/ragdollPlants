import React from 'react';
import { UploadButton } from '@/app/_components/common/UploadButton';
import { MAX_GALLERY_PHOTOS } from '@/types/models/gallery';
import { GalleryTitleSectionProps } from '@/types/components/galleries';

export const GalleryTitleSection = ({ photoCount }: GalleryTitleSectionProps) => {
  return (
    <div className="mt-16 w-full p-4">
      <div className="relative flex flex-col items-center">
        <div className="text-center text-white">
          <h1 className="mb-1 sm:text-3xl text-2xl font-bold">My Plant Gallery</h1>
          <p className="mb-8 sm:text-sm text-xs opacity-80">
            내 소중한 식물들의 아름다운 순간들
          </p>
          <div className="mx-auto mb-8 h-px w-16 bg-white opacity-30"></div>
        </div>

        {/* 버튼 절대 위치로 오른쪽 상단에 배치 */}
        <div className="absolute top-0 right-0">
          {/* 사진 추가 버튼 (아직 최대 사진 수에 도달하지 않은 경우만 표시) */}
          {photoCount < MAX_GALLERY_PHOTOS && (
            <UploadButton
              link="/galleries/upload"
              count={photoCount}
              maxCount={MAX_GALLERY_PHOTOS}
            />
          )}
        </div>
      </div>
    </div>
  );
}; 