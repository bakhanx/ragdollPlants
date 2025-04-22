'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import ContentLayout from '@/app/_components/layout/ContentsLayout';
import Header from '@/app/_components/layout/Header';
import Image from 'next/image';
import { CloseIcon } from '@/app/_components/icons/Icons';

// 최대 갤러리 사진 개수
const MAX_GALLERY_PHOTOS = 10;

export default function UploadGalleryPage() {
  const router = useRouter();

  // useRef로 파일 입력 요소 참조 생성
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // 이미지 업로드 처리
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 삭제 처리
  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setImageFile(null);
    setImagePreview(null);
  };

  // 이미지 영역 클릭 핸들러
  const handleImageAreaClick = () => {
    if (!imagePreview) {
      // useRef를 사용하여 파일 입력 요소에 접근
      fileInputRef.current?.click();
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
      <ContentLayout noPadding>
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
                    : 'bg-gray-300 text-gray-800'
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
          {/* 갤러리 프리뷰 */}
          <div className="mb-8">
            <div
              className="relative overflow-hidden rounded-lg border-2 border-dashed border-gray-300 shadow-lg transition-all duration-500 hover:cursor-pointer hover:shadow-xl"
              onClick={handleImageAreaClick}>
              <div className="relative aspect-square">
                {imagePreview ? (
                  <>
                    <Image
                      src={imagePreview}
                      alt="갤러리 미리보기"
                      fill
                      className="object-cover transition-transform duration-700"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="bg-opacity-50 hover:bg-opacity-70 absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white">
                      <CloseIcon
                        size={18}
                        className="[&_path]:stroke-white"
                      />
                    </button>

                    {/* 오버레이 및 정보 - 프리뷰 */}
                    {showOverlay && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
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
                  </>
                ) : (
                  <div className="bg-opacity-30 flex h-full flex-col items-center justify-center text-center text-white">
                    <div className="border-opacity-50 mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 border-white">
                      <span className="text-3xl">+</span>
                    </div>
                    <p className="mb-1 text-lg">이미지를 업로드하세요</p>
                    <p className="text-xs opacity-70">
                      고품질 이미지를 권장합니다
                    </p>
                  </div>
                )}
              </div>
            </div>
            <input
              ref={fileInputRef}
              id="gallery-image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              required
            />
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

            {/* <div>
              <label
                htmlFor="description"
                className="mb-1 block text-sm font-medium text-gray-50">
                설명
              </label>
              <textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                placeholder="사진에 대한 설명을 입력해주세요 (선택사항)"
                maxLength={200}
                className="w-full rounded-md border border-gray-300 bg-opacity-20 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
              />
              <p className="mt-1 text-right text-xs text-gray-300">
                {description.length}/200
              </p>
            </div> */}
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
      </ContentLayout>
    </>
  );
}
