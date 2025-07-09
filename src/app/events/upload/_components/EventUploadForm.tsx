'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUploadSection } from './ImageUploadSection';
import { EventDetailsSection } from './EventDetailsSection';
import { SubmitButton } from './SubmitButton';

export interface EventUploadFormProps {
  isLoading?: boolean;
  mode?: 'create' | 'edit';
  initialData?: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    content: string;
    image: string | null;
    startDate: Date;
    endDate: Date;
  };
}

// 메인 폼 컴포넌트
export const EventUploadForm = ({
  isLoading = false,
  mode = 'create',
  initialData
}: EventUploadFormProps) => {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || '');
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || '');
  const [period, setPeriod] = useState('');
  const [description, setDescription] = useState(initialData?.description || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);
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

    if (!title || !subtitle || !period || !description) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    // 편집 모드에서는 이미지가 필수가 아님
    if (mode === 'create' && !imageFile) {
      alert('이미지를 업로드해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('subtitle', subtitle);
      formData.append('description', description);
      formData.append('content', content);
      formData.append('link', '#'); // 임시 링크
      formData.append('startDate', new Date().toISOString());
      formData.append('endDate', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()); // 30일 후
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      // mode에 따라 다른 액션 함수 호출
      if (mode === 'edit' && initialData) {
        const { updateEvent } = await import('@/app/actions/events');
        await updateEvent(parseInt(initialData.id), formData);
        alert('이벤트가 성공적으로 수정되었습니다.');
        router.push(`/events/${initialData.id}`);
      } else {
        const { createEvent } = await import('@/app/actions/events');
        await createEvent(formData);
        alert('이벤트가 성공적으로 등록되었습니다.');
        router.push('/events');
      }
    } catch (error) {
      const actionText = mode === 'edit' ? '수정' : '등록';
      console.error(`이벤트 ${actionText} 실패:`, error);
      alert(`이벤트 ${actionText}에 실패했습니다. 다시 시도해주세요.`);
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
