'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUploader } from '@/app/_components/common/ImageUploader';

export interface EventUploadFormProps {
  isLoading?: boolean;
}

export const EventUploadForm = ({ isLoading = false }: EventUploadFormProps) => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [period, setPeriod] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 이미지 변경 핸들러
  const handleImageChange = (file: File | null) => {
    setImageFile(file);

    if (file) {
      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !subtitle || !period || !description || !imageFile) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 실제 구현에서는 이미지를 서버에 업로드하고 URL을 받아와야 함
      // 이벤트 데이터를 서버에 전송하는 로직 구현 필요

      // 성공 시 이벤트 목록 페이지로 이동
      alert('이벤트가 성공적으로 등록되었습니다.');
      router.push('/events');
    } catch (error) {
      console.error('이벤트 등록 실패:', error);
      alert('이벤트 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md py-4">
      <form
        onSubmit={handleSubmit}
        className="space-y-6">
        {/* 이미지 업로드 */}
        <ImageUploader
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
          label="이벤트 이미지"
          required={true}
          aspectRatio="landscape"
          placeholder="클릭하여 이미지 업로드"
          infoText="JPG, PNG, WebP 형식 (최대 5MB)"
        />

        {/* 제목 */}
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-50">
            이벤트 제목 <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
            placeholder="예: 봄맞이 가드닝 이벤트"
            required
          />
        </div>

        {/* 부제목 */}
        <div className="space-y-2">
          <label
            htmlFor="subtitle"
            className="block text-sm font-medium text-gray-50">
            부제목 <span className="text-red-500">*</span>
          </label>
          <input
            id="subtitle"
            type="text"
            value={subtitle}
            onChange={e => setSubtitle(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
            placeholder="예: 신규 회원 20% 할인"
            required
          />
        </div>

        {/* 기간 */}
        <div className="space-y-2">
          <label
            htmlFor="period"
            className="block text-sm font-medium text-gray-50">
            이벤트 기간 <span className="text-red-500">*</span>
          </label>
          <input
            id="period"
            type="text"
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
            placeholder="예: 2024.05.01 ~ 2024.05.31"
            required
          />
        </div>

        {/* 설명 */}
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-50">
            이벤트 설명 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
            placeholder="이벤트에 대한 간략한 설명을 입력해주세요."
            required
          />
        </div>

        {/* 상세 내용 */}
        <div className="space-y-2">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-50">
            상세 내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={5}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
            placeholder="이벤트 상세 내용을 입력해주세요."
          />
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={isLoading || isSubmitting}
          className="w-full rounded-md bg-green-600 py-2 text-white transition-colors hover:bg-green-700 disabled:bg-gray-400">
          {isLoading || isSubmitting ? '등록 중...' : '이벤트 등록하기'}
        </button>
      </form>
    </div>
  );
}; 