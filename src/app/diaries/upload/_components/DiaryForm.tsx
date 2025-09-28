'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useImageUpload } from '@/app/_hooks/useImageUpload';
import { Input, Textarea, LoadingOverlay } from '@/app/_components/common';
import { SelectedPlantInfo } from './SelectedPlantInfo';
import { PlantSelector } from './PlantSelector';
import { DiaryMoodSelector, moodOptions } from './DiaryMoodSelector';
import { DiaryImageUploadSection } from './DiaryImageUploadSection';
import { createDiary, updateDiary } from '@/app/actions/diaries';
import { getMyPlantsBasicInfo } from '@/app/actions/plants';

const MAX_PHOTO_COUNT = 1; // 최대 사진 개수 (단일 이미지)

interface DiaryFormProps {
  mode?: 'create' | 'edit';
  initialData?: {
    id: string;
    title: string;
    content: string;
    status: string;
    date: string;
    plantId: string | null;
    image: string | null;
  };
}

export const DiaryForm = ({
  mode = 'create',
  initialData
}: DiaryFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plantIdFromParams = searchParams.get('plantId');

  // 내 식물 목록 상태
  const [myPlants, setMyPlants] = useState<{ id: string; name: string }[]>([]);
  const [plantsLoading, setPlantsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 선택된 식물 ID 상태 - 편집 모드일 때 초기값 설정
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(
    initialData?.plantId || plantIdFromParams
  );

  // 폼 상태 관리 - 편집 모드일 때 초기값 설정
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [mood, setMood] = useState(initialData?.status || 'good');

  // 이미지 업로드 훅 사용 - 편집 모드일 때 초기 이미지 설정
  const { imageFiles, imagePreviews, handleMultiImageChange } = useImageUpload({
    maxFiles: MAX_PHOTO_COUNT,
    onError: message => alert(message),
    initialImages: initialData?.image ? [initialData.image] : []
  });

  // 내 식물 목록 로드 및 초기화
  useEffect(() => {
    const loadMyPlants = async () => {
      setPlantsLoading(true);
      try {
        const plants = await getMyPlantsBasicInfo();
        setMyPlants(plants);
      } catch (error) {
        console.error('식물 목록 로딩 오류:', error);
        alert('식물 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setPlantsLoading(false);
      }
    };

    loadMyPlants();
  }, []);

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // FormData 생성
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('status', mood);
      
      if (mode === 'edit' && initialData) {
        formData.append('date', initialData.date);
      } else {
        formData.append('date', new Date().toISOString());
      }

      // 선택된 식물이 있으면 추가
      if (selectedPlantId) {
        formData.append('plantId', selectedPlantId);
      }

      // 이미지 파일들 추가 (첫 번째 이미지만 사용)
      const validImages = imageFiles.filter(file => file);
      if (validImages.length > 0) {
        // 새로 업로드된 이미지가 있는 경우
        formData.append('image', validImages[0]);
      } else if (mode === 'edit' && initialData?.image && imagePreviews.length > 0) {
        // 편집 모드에서 새 이미지 업로드 없이 기존 이미지 유지
        formData.append('existingImage', initialData.image);
      }

      // 태그 추가 (빈 배열로 초기화)
      formData.append('tags', JSON.stringify([]));

      // mode에 따라 다른 액션 함수 호출
      let result;
      if (mode === 'edit' && initialData) {
        result = await updateDiary(initialData.id, formData);
      } else {
        result = await createDiary(formData);
      }

      if (result?.success) {
        // 성공 시 즉시 로딩 상태 해제 및 리다이렉트
        setIsSubmitting(false);
        router.push(result.redirectTo!);
        return; // finally 블록 실행 방지
      } else {
        // 실패 시 에러 메시지 표시
        const actionText = mode === 'edit' ? '수정' : '생성';
        alert(result?.error || `다이어리 ${actionText}에 실패했습니다.`);
      }
    } catch (error) {
      const actionText = mode === 'edit' ? '수정' : '생성';
      console.error(`다이어리 ${actionText} 오류:`, error);
      alert(
        error instanceof Error
          ? error.message
          : `다이어리 ${actionText} 중 오류가 발생했습니다.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <LoadingOverlay
        isVisible={isSubmitting}
        message={mode === 'edit' ? '일기를 수정하고 있어요...' : '일기를 저장하고 있어요...'}
        description={mode === 'edit' ? '변경사항을 저장하고 있습니다.' : '소중한 기록을 저장하고 있어요!'}
      />
      
      <form
        onSubmit={handleSubmit}
        className="mt-2 w-full">
        {/* 식물 선택 */}
        {plantIdFromParams ? (
          // 식물 디테일 페이지에서 리다이렉트
          <SelectedPlantInfo
            selectedPlant={
              myPlants.find(plant => plant.id === selectedPlantId) || null
            }
          />
        ) : (
          // 일반 일기 작성 - 식물 선택 드롭다운 표시
          <PlantSelector
            plants={myPlants}
            selectedPlantId={selectedPlantId}
            onPlantSelect={setSelectedPlantId}
            isLoading={plantsLoading}
          />
        )}

        {/* 기본 정보 폼 */}
        <div className="space-y-4">
          <Input
            id="title"
            type="text"
            label="제목"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            placeholder="일기 제목을 입력해주세요."
          />

          <Textarea
            id="content"
            label="내용"
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            rows={6}
            placeholder="오늘 식물에 대한 생각이나 변화를 기록해보세요."
          />

          {/* 무드 선택 컴포넌트 */}
          <DiaryMoodSelector
            mood={mood}
            setMood={setMood}
          />

          {/* 이미지 업로드 섹션 */}
          <DiaryImageUploadSection
            maxPhotoCount={MAX_PHOTO_COUNT}
            imagePreviews={imagePreviews}
            handleMultiImageChange={handleMultiImageChange}
          />
        </div>

        {/* 등록 버튼 */}
        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            className="w-full rounded-md bg-green-600 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            disabled={!title.trim() || !content.trim() || isSubmitting}>
            {isSubmitting 
              ? (mode === 'edit' ? '수정 중...' : '저장 중...') 
              : (mode === 'edit' ? '수정하기' : '저장하기')
            }
          </button>
        </div>
      </form>
    </>
  );
};
