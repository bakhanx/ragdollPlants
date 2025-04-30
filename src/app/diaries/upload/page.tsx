'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import { useAuth } from '@/app/_hooks/useAuth';
import { ImageUploader } from '@/app/_components/common/ImageUploader';
import { useImageUpload } from '@/app/_hooks/useImageUpload';

const MAX_FREE_PHOTO_DIARIES = 3; // 무료 회원이 사진 첨부 가능한 일기 수
const MAX_PAID_PHOTO_COUNT = 5; // 최대 사진 개수

// 상태 옵션 데이터
const moodOptions = [
  { value: '좋음', label: '아주 좋아요', icon: '😊' },
  { value: '보통', label: '보통이에요', icon: '😐' },
  { value: '나쁨', label: '조금 걱정되요', icon: '😕' },
  { value: '아픔', label: '상태가 안좋아요', icon: '😢' }
];

export default function CreateDiaryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plantId = searchParams.get('plantId');
  const { isLoggedIn } = useAuth();

  // 구독 상태 임시 설정 (실제로는 API 호출)
  const [isPaidUser, setIsPaidUser] = useState(false);

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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlant) {
      alert('식물을 선택해주세요.');
      return;
    }

    // 여기서 API 호출을 통해 데이터를 서버에 저장
    // 실제 구현에서는 API 호출 코드가 들어갈 자리
    console.log({
      plantId: selectedPlant.id,
      title,
      content,
      mood,
      images: imageFiles.filter(file => file), // null 제거
      hasImages: imageFiles.filter(file => file).length > 0
    });

    // 작성 완료 후 식물 상세 페이지로 이동
    router.push(`/myplants/${selectedPlant.id}`);
  };

  // 구독 페이지로 이동
  const handleUpgradeClick = () => {
    router.push('/subscription');
  };

  // 테스트용 구독 상태 토글
  const toggleSubscription = () => {
    setIsPaidUser(!isPaidUser);
  };

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-06.webp" />
      <ContentsLayout showFooter={false}>
        <Header
          title="일기 작성"
          showBack
        />

        {/* 테스트용 구독 상태 토글 버튼 */}
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            onClick={toggleSubscription}
            className={`rounded-md px-3 py-1 text-xs ${
              isPaidUser
                ? 'bg-green-600 text-white'
                : 'bg-gray-300 text-gray-700'
            }`}>
            {isPaidUser ? '구독 상태 ✓' : '미구독 상태'}
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-2 w-full">
          {/* 선택된 식물 정보 */}
          {selectedPlant ? (
            <div className="mb-4 rounded-lg bg-green-50 p-3">
              <span className="text-sm font-medium text-gray-200">
                선택된 식물:{' '}
                <span className="text-green-600">{selectedPlant.name}</span>
              </span>
            </div>
          ) : (
            <div className="mb-4 rounded-lg bg-amber-50 p-3">
              <span className="text-sm text-amber-800">
                식물을 선택해주세요.
              </span>
            </div>
          )}

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

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-50">
                오늘의 상태
              </label>
              <div className="grid grid-cols-2 gap-2">
                {moodOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMood(option.value)}
                    className={`flex items-center rounded-md border px-3 py-2 text-sm transition-colors ${
                      mood === option.value
                        ? 'border-green-600 bg-green-600 text-white'
                        : 'border-gray-300 text-gray-50 hover:text-green-600'
                    }`}>
                    <span className="mr-2 text-lg">{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 이미지 업로드 섹션 */}
            <div className="pt-2">
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-50">
                  사진 첨부
                  <span className="ml-1 text-xs text-gray-400">
                    {isPaidUser
                      ? `(최대 ${MAX_PAID_PHOTO_COUNT}장)`
                      : `(${imagePreviews.length}/${MAX_FREE_PHOTO_DIARIES}장)`}
                  </span>
                </label>
                {!isPaidUser && photoLimit.used >= MAX_FREE_PHOTO_DIARIES && (
                  <span
                    className="cursor-pointer text-xs text-blue-500"
                    onClick={handleUpgradeClick}>
                    구독하고 더 많은 사진 추가하기
                  </span>
                )}
              </div>

              {photoLimit.canAddPhotos ? (
                <div className="mb-3">
                  {!isPaidUser && (
                    <p className="mb-2 text-xs text-gray-200">
                      무료 회원은 최대 {MAX_FREE_PHOTO_DIARIES}개의 일기에만
                      사진을 첨부할 수 있습니다.
                      <br />
                      현재 {photoLimit.used}개 사용 / {photoLimit.remaining}개
                      남음
                    </p>
                  )}

                  {/* 이미지 슬롯 그리드 - ImageUploader 사용 */}
                  <div className="mb-3 grid grid-cols-3 gap-2">
                    {Array.from({ length: maxPhotoCount }).map((_, index) => {
                      const hasImage =
                        index < imagePreviews.length && !!imagePreviews[index];
                      const isNextSlot = index === imagePreviews.length;

                      return (
                        <ImageUploader
                          key={index}
                          imagePreview={hasImage ? imagePreviews[index] : null}
                          onImageChange={file =>
                            handleMultiImageChange(file, index)
                          }
                          multiMode={true}
                          index={index}
                          isAddButton={isNextSlot}
                          aspectRatio="square"
                          showRemoveButton={hasImage}
                          className="text-xs"
                        />
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-opacity-20 mb-3 rounded-lg bg-gray-700 p-3 text-center">
                  <p className="mb-2 text-sm text-gray-200">
                    무료 사진 첨부 일기를 모두 사용했습니다.
                  </p>
                  <button
                    type="button"
                    onClick={handleUpgradeClick}
                    className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">
                    구독 플랜 보기
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 등록 버튼 */}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              className="w-full rounded-md bg-green-600 py-2 text-white hover:bg-green-700"
              disabled={!selectedPlant}>
              저장하기
            </button>
          </div>
        </form>
      </ContentsLayout>
    </>
  );
}
