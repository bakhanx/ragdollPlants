'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import GalleryUsageInfo from './GalleryUsageInfo';
import GalleryPreview from './GalleryPreview';
import GalleryTitleField from './GalleryTitleField';
import SubmitButton from './GalleryUploadButton';
import { createGallery, getUserGalleries } from '@/app/actions/galleries';
import { MAX_GALLERY_PHOTOS } from '@/types/models/gallery';

// 갤러리 업로드 전용 컴포넌트 (편집은 별도 컴포넌트에서 처리)
export default function GalleryUploadForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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
  const [error, setError] = useState<string | null>(null);

  // 사용자의 갤러리 사용 현황 로드
  useEffect(() => {
    const loadGalleryUsage = async () => {
      try {
        const userGalleries = await getUserGalleries();
        const used = userGalleries.length;

        setGalleryUsage({
          used,
          remaining: MAX_GALLERY_PHOTOS - used
        });
      } catch (error) {
        console.error('갤러리 사용 현황 로드 실패:', error);
        // 에러 발생시 기본값 사용
        setGalleryUsage({
          used: 0,
          remaining: MAX_GALLERY_PHOTOS
        });
      }
    };

    loadGalleryUsage();
  }, []);

  // 이미지 변경 핸들러
  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    setError(null); // 에러 초기화

    if (file) {
      // 파일 크기 체크 (10MB = 10 * 1024 * 1024 bytes)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setError(
          `파일 크기가 너무 큽니다. 최대 10MB까지 업로드 가능합니다. (현재: ${(file.size / 1024 / 1024).toFixed(1)}MB)`
        );
        return;
      }

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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 이미지는 필수
    if (!imageFile) {
      setError('이미지를 업로드해주세요.');
      return;
    }

    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }

    // 갤러리 개수 제한 확인
    if (galleryUsage.remaining <= 0) {
      setError(
        `갤러리는 최대 ${MAX_GALLERY_PHOTOS}개까지만 등록할 수 있습니다.`
      );
      return;
    }

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('title', title.trim());
        if (description.trim()) {
          formData.append('description', description.trim());
        }

        if (imageFile) {
          formData.append('image', imageFile);
        }

        // 갤러리 생성
        const result = await createGallery(formData);
        if (result.success) {
          router.push('/galleries');
        }
      } catch (error) {
        console.error('갤러리 업로드 실패:', error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('갤러리 업로드 중 오류가 발생했습니다.');
        }
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-md px-4 pb-20">
      {/* 갤러리 사용 현황 정보 */}
      <GalleryUsageInfo
        used={galleryUsage.used}
        max={MAX_GALLERY_PHOTOS}
      />

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* 갤러리 프리뷰 - 이미지 업로더 및 오버레이 */}
      <GalleryPreview
        imagePreview={imagePreview}
        title={title}
        showOverlay={showOverlay}
        handleImageChange={handleImageChange}
      />

      {/* 제목 및 설명 폼 */}
      <div className="space-y-4">
        <GalleryTitleField
          title={title}
          setTitle={setTitle}
        />

        {/* 설명 필드 */}
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-white">
            설명 (선택사항)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="갤러리에 대한 간단한 설명을 입력하세요..."
            className="w-full resize-none rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-white placeholder-white/60 backdrop-blur-sm focus:border-white/40 focus:outline-none"
            rows={3}
            maxLength={200}
          />
          <div className="mt-1 text-right text-xs text-white/60">
            {description.length}/200
          </div>
        </div>
      </div>

      {/* 등록 버튼 */}
      <SubmitButton
        disabled={
          !title.trim() ||
          isPending ||
          !imageFile ||
          galleryUsage.remaining <= 0
        }
        isLoading={isPending}
      />
    </form>
  );
}
