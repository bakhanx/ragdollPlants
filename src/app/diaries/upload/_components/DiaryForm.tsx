'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useImageUpload } from '@/app/_hooks/useImageUpload';
import { SelectedPlantInfo } from './SelectedPlantInfo';
import { DiaryMoodSelector, moodOptions } from './DiaryMoodSelector';
import { DiaryImageUploadSection } from './DiaryImageUploadSection';
import { createDiary } from '@/app/actions/diaries';

const MAX_FREE_PHOTO_DIARIES = 3; // 무료 회원이 사진 첨부 가능한 일기 수
const MAX_PAID_PHOTO_COUNT = 5; // 최대 사진 개수

interface DiaryFormProps {
  isPaidUser: boolean;
  toggleSubscription: () => void;
}

export const DiaryForm = ({
  isPaidUser,
  toggleSubscription
}: DiaryFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plantId = searchParams.get('plantId');

  // 선택된 식물 정보 (실제로는 API로 가져올 정보)
  const [selectedPlant, setSelectedPlant] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // 폼 상태 관리
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(moodOptions[0].value);

  // 이미지 업로드 훅 사용
  const { imageFiles, imagePreviews, handleMultiImageChange } = useImageUpload({
    maxFiles: isPaidUser ? MAX_PAID_PHOTO_COUNT : MAX_FREE_PHOTO_DIARIES,
    onError: message => alert(message)
  });

  // 사용자 제한 관련 상태
  const [photoLimit, setPhotoLimit] = useState({
    used: 0, // 현재까지 사용한 사진 첨부 일기 수
    remaining: MAX_FREE_PHOTO_DIARIES, // 남은 사진 첨부 가능 일기 수
    canAddPhotos: true // 사진 첨부 가능 여부
  });

  // 업로드할 이미지 수 제한 (구독 여부에 따라)
  const maxPhotoCount = isPaidUser
    ? MAX_PAID_PHOTO_COUNT
    : MAX_FREE_PHOTO_DIARIES;

  // 선택된 식물 정보 로드 (실제로는 API 호출)
  useEffect(() => {
    if (plantId) {
      // 임시 데이터 - 실제로는 API 호출하여 식물 정보 가져오기
      setSelectedPlant({
        id: plantId,
        name: '몬스테라'
      });
    }

    // 임시 데이터 - 실제로는 API 호출하여 사용자의 사진 첨부 일기 사용 현황 가져오기
    const mockUserPhotoUsage = 1; // 이미 1개의 사진 첨부 일기를 작성했다고 가정

    setPhotoLimit({
      used: mockUserPhotoUsage,
      remaining: MAX_FREE_PHOTO_DIARIES - mockUserPhotoUsage,
      canAddPhotos: mockUserPhotoUsage < MAX_FREE_PHOTO_DIARIES || isPaidUser
    });
  }, [plantId, isPaidUser]);

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
      formData.append('date', new Date().toISOString());
      
      // 선택된 식물이 있으면 추가
      if (selectedPlant) {
        formData.append('plantId', selectedPlant.id);
      }

      // 이미지 파일들 추가 (첫 번째 이미지만 사용)
      const validImages = imageFiles.filter(file => file);
      if (validImages.length > 0) {
        formData.append('image', validImages[0]);
      }

      // 태그 추가 (빈 배열로 초기화)
      formData.append('tags', JSON.stringify([]));

      // 다이어리 생성 액션 함수 호출
      await createDiary(formData);
      
      // createDiary에서 자동으로 리다이렉트되므로 여기서는 추가 처리 불필요
    } catch (error) {
      console.error('다이어리 생성 오류:', error);
      alert(error instanceof Error ? error.message : '다이어리 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      {/* 테스트용 구독 상태 토글 버튼 */}
      <div className="mb-2 flex justify-end">
        <button
          type="button"
          onClick={toggleSubscription}
          className={`rounded-md px-3 py-1 text-xs ${
            isPaidUser ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-700'
          }`}>
          {isPaidUser ? '구독 상태 ✓' : '미구독 상태'}
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-2 w-full">
        {/* 선택된 식물 정보 */}
        <SelectedPlantInfo selectedPlant={selectedPlant} />

        {/* 기본 정보 폼 */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="mb-1 block text-sm font-medium text-gray-50">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="일기 제목을 입력해주세요."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="mb-1 block text-sm font-medium text-gray-50">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              rows={6}
              placeholder="오늘 식물에 대한 생각이나 변화를 기록해보세요."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* 무드 선택 컴포넌트 */}
          <DiaryMoodSelector
            mood={mood}
            setMood={setMood}
          />

          {/* 이미지 업로드 섹션 */}
          <DiaryImageUploadSection
            isPaidUser={isPaidUser}
            maxPhotoCount={maxPhotoCount}
            photoLimit={photoLimit}
            imagePreviews={imagePreviews}
            handleMultiImageChange={handleMultiImageChange}
          />
        </div>

        {/* 등록 버튼 */}
        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            className="w-full rounded-md bg-green-600 py-2 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!title.trim() || !content.trim()}>
            저장하기
          </button>
        </div>
      </form>
    </>
  );
};
