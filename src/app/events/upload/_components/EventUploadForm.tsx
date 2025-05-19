'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormField } from './FormField';
import { ImageUploadSection } from './ImageUploadSection';
import { EventDetailsSection } from './EventDetailsSection';
import { SubmitButton } from './SubmitButton';

export interface EventUploadFormProps {
  isLoading?: boolean;
}

// 메인 폼 컴포넌트
export const EventUploadForm = ({
  isLoading = false
}: EventUploadFormProps) => {
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
      //임시로 메시지 출력
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
        <ImageUploadSection
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
        />

        <EventDetailsSection
          title={title}
          setTitle={setTitle}
          subtitle={subtitle}
          setSubtitle={setSubtitle}
          period={period}
          setPeriod={setPeriod}
          description={description}
          setDescription={setDescription}
          content={content}
          setContent={setContent}
        />

        <SubmitButton
          isLoading={isLoading}
          isSubmitting={isSubmitting}
        />
      </form>
    </div>
  );
};
