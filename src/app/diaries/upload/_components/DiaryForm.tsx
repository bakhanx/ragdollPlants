'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useImageUpload } from '@/app/_hooks/useImageUpload';
import { Input, Textarea } from '@/app/_components/common';
import { SelectedPlantInfo } from './SelectedPlantInfo';
import { PlantSelector } from './PlantSelector';
import { DiaryMoodSelector, moodOptions } from './DiaryMoodSelector';
import { DiaryImageUploadSection } from './DiaryImageUploadSection';
import { createDiary, updateDiary } from '@/app/actions/diaries';
import { getMyPlantsBasicInfo } from '@/app/actions/plants';

const MAX_PHOTO_COUNT = 5; // 최대 사진 개수

interface DiaryFormProps {
  mode?: 'create' | 'edit';
  initialData?: {
    id: string;
    title: string;
    content: string;
    status: string;
    date: Date;
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

  // 선택된 식물 ID 상태 - 편집 모드일 때 초기값 설정
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(
    initialData?.plantId || plantIdFromParams
  );

  // 폼 상태 관리 - 편집 모드일 때 초기값 설정
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [mood, setMood] = useState(initialData?.status || 'good');

  // 이미지 업로드 훅 사용
  const { imageFiles, imagePreviews, handleMultiImageChange } = useImageUpload({
    maxFiles: MAX_PHOTO_COUNT,
    onError: message => alert(message)
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

    try {
      // FormData 생성
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('status', mood);
      
      if (mode === 'edit' && initialData) {
        formData.append('date', initialData.date.toISOString());
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
        formData.append('image', validImages[0]);
      }

      // 태그 추가 (빈 배열로 초기화)
      formData.append('tags', JSON.stringify([]));

      // mode에 따라 다른 액션 함수 호출
      if (mode === 'edit' && initialData) {
        await updateDiary(initialData.id, formData);
      } else {
      await createDiary(formData);
      }
    } catch (error) {
      // Next.js redirect 에러 무시
      if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
        return;
      }

      const actionText = mode === 'edit' ? '수정' : '생성';
      console.error(`다이어리 ${actionText} 오류:`, error);
      alert(
        error instanceof Error
          ? error.message
          : `다이어리 ${actionText} 중 오류가 발생했습니다.`
      );
    }
  };

  return (
    <>
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
            disabled={!title.trim() || !content.trim()}>
            {mode === 'edit' ? '수정하기' : '저장하기'}
          </button>
        </div>
      </form>
    </>
  );
};
