'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import { ImageUploader } from '@/app/_components/common/ImageUploader';

// 최대 갤러리 사진 개수
const MAX_GALLERY_PHOTOS = 10;

export default function UploadGalleryPage() {
  const router = useRouter();

  // 갤러리 사용 현황
  const [galleryUsage, setGalleryUsage] = useState({
    used: 0,
    remaining: MAX_GALLERY_PHOTOS
  });

  // 폼 상태 관리
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);

  // 갤러리 사용 현황 로드 (실제로는 API 호출)
  useEffect(() => {
    // 임시 데이터 - 실제로는 API 호출하여 갤러리 사용 현황 가져오기
    const mockGalleryUsed = 4; // 예: 이미 4개의 갤러리 사진이 업로드되었다고 가정

    setGalleryUsage({
      used: mockGalleryUsed,
      remaining: MAX_GALLERY_PHOTOS - mockGalleryUsed
    });
  }, []);

  // 이미지 변경 핸들러
  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    
    if (file) {
      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // 오버레이 토글 핸들러
  const toggleOverlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setShowOverlay(prev => !prev);
  };

  // 폼 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      alert('이미지를 업로드해주세요.');
      return;
    }

    // 여기서 API 호출을 통해 데이터를 서버에 저장
    // 실제 구현에서는 API 호출 코드가 들어갈 자리
    console.log({
      title,
      description,
      imageFile
    });

    // 업로드 완료 후 갤러리 페이지로 이동
    router.push('/galleries');
  };

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-06.webp" />
      <ContentsLayout showFooter={false}>
        <Header
          title="갤러리 업로드"
          showBack
          variant="glass"
        />

        {/* 갤러리 타이틀 섹션 */}
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
              {galleryUsage.used}/{MAX_GALLERY_PHOTOS} 등록됨
            </p>
          </div>
        </div>

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
      </ContentsLayout>
    </>
  );
}
