'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GalleryUsageInfo from './GalleryUsageInfo';
import GalleryPreview from './GalleryPreview';
import GalleryTitleField from './GalleryTitleField';
import SubmitButton from './GalleryUploadButton';

// 최대 갤러리 사진 개수
const MAX_GALLERY_PHOTOS = 10;

export default function GalleryUploadForm() {
  const router = useRouter();

  // 갤러리 사용 현황
  const [galleryUsage, setGalleryUsage] = useState({
    used: 0,
    remaining: MAX_GALLERY_PHOTOS
  });

  // 폼 상태 관리
  const [title, setTitle] = useState('');
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
      imageFile
    });

    // 업로드 완료 후 갤러리 페이지로 이동
    router.push('/galleries');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-md px-4 pb-20">
      
      {/* 갤러리 사용 현황 정보 */}
      <GalleryUsageInfo used={galleryUsage.used} max={MAX_GALLERY_PHOTOS} />
      
      {/* 갤러리 프리뷰 - 이미지 업로더 및 오버레이 */}
      <GalleryPreview
        imagePreview={imagePreview}
        title={title}
        showOverlay={showOverlay}
        handleImageChange={handleImageChange}
      />

      {/* 제목 및 설명 폼 */}
      <div className="space-y-4">
        <GalleryTitleField title={title} setTitle={setTitle} />
      </div>

      {/* 등록 버튼 */}
      <SubmitButton disabled={!imageFile} />
    </form>
  );
} 