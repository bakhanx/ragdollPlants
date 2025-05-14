'use client';

import React from 'react';
import { ImageUploader } from '@/app/_components/common/ImageUploader';

interface GalleryUploadFormProps {
  title: string;
  setTitle: (title: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleImageChange: (file: File | null) => void;
  imageFile: File | null;
  imagePreview: string | null;
  showOverlay: boolean;
}

export default function GalleryUploadForm({
  title,
  setTitle,
  handleSubmit,
  handleImageChange,
  imageFile,
  imagePreview,
  showOverlay
}: GalleryUploadFormProps) {
  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-md px-4 pb-20">
      {/* 갤러리 프리뷰 - ImageUploader 컴포넌트 사용 */}
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

      {/* 제목 및 설명 폼 */}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="mb-1 block text-sm font-medium text-gray-50">
            작품명 <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            placeholder="작품명을 입력해주세요 (최대 30자)"
            maxLength={30}
            className="bg-opacity-20 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-white focus:ring-1 focus:ring-white focus:outline-none"
          />
        </div>
      </div>

      {/* 등록 버튼 */}
      <div className="mt-8 flex justify-center">
        <button
          type="submit"
          disabled={!imageFile}
          className="w-full rounded-md bg-green-600 py-2 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:text-gray-600">
          저장하기
        </button>
      </div>
    </form>
  );
} 