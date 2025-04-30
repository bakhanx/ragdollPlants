'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import { ScheduleIcon } from '@/app/_components/icons/Icons';
import { ImageUploader } from '@/app/_components/common/ImageUploader';

// 식물 종류 옵션 배열
const plantTypeOptions = [
  { value: '실내식물', label: '실내식물' },
  { value: '다육식물', label: '다육식물' },
  { value: '선인장', label: '선인장' },
  { value: '관엽식물', label: '관엽식물' },
  { value: '허브', label: '허브' },
  { value: '기타', label: '기타' }
];

export default function RegisterPlantPage() {
  const router = useRouter();

  // 폼 상태 관리
  const [plantName, setPlantName] = useState('');
  const [plantType, setPlantType] = useState(plantTypeOptions[0].value);
  const [location, setLocation] = useState('');
  const [acquiredDate, setAcquiredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  // 오늘 날짜 가져오기
  const today = new Date().toISOString().split('T')[0];

  // 날짜 선택 필드 포커스 참조
  const dateInputRef = React.useRef<HTMLInputElement>(null);

  // 날짜 필드 클릭 핸들러 - 전체 영역 클릭 시 input에 포커스
  const handleDateFieldClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  // 폼 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!plantType) {
      alert('식물 종류를 선택해주세요.');
      return;
    }

    // 여기서 API 호출을 통해 데이터를 서버에 저장
    // 실제 구현에서는 API 호출 코드가 들어갈 자리

    console.log({
      plantName,
      plantType,
      location,
      acquiredDate,
      notes,
      imageFile
    });

    // 등록 완료 후 내 식물 목록 페이지로 이동
    router.push('/myplants');
  };

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-04.webp" />
      <ContentsLayout>
        <Header
          title="새 식물 등록"
          showBack
        />

        <form
          onSubmit={handleSubmit}
          className="mt-4 w-full">
          {/* 이미지 업로드 섹션 */}
          <div className="mb-6">
            <ImageUploader
              imagePreview={imagePreview}
              onImageChange={handleImageChange}
              aspectRatio="square"
              label="식물 사진"
              required={false}
            />
          </div>

          {/* 기본 정보 폼 */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="plant-name"
                className="mb-1 block text-sm font-medium text-gray-50">
                식물 이름 <span className="text-red-500">*</span>
              </label>
              <input
                id="plant-name"
                type="text"
                value={plantName}
                onChange={e => setPlantName(e.target.value)}
                required
                placeholder="예) 몬스테라, 산세베리아"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-50">
                식물 종류 <span className="text-red-500">*</span>
              </label>

              {/* 식물 종류 버튼 그룹 */}
              <div className="grid grid-cols-4 gap-2">
                {plantTypeOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPlantType(option.value)}
                    className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                      plantType === option.value
                        ? 'border-green-600 bg-green-600 text-white'
                        : 'border-gray-300 text-gray-50 hover:text-green-600'
                    }`}>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="location"
                className="mb-1 block text-sm font-medium text-gray-50">
                위치
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="예) 거실 창가, 베란다"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="acquired-date"
                className="mb-1 block text-sm font-medium text-gray-50">
                입양일 <span className="text-red-500">*</span>
              </label>
              <div
                className="relative cursor-pointer rounded-md border border-gray-300"
                onClick={handleDateFieldClick}>
                <div className="flex items-center">
                  <div className="flex-grow px-3 py-2">
                    {acquiredDate ? (
                      <span className="text-sm text-gray-50">
                        {new Date(acquiredDate).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-200">
                        날짜를 선택해주세요
                      </span>
                    )}
                  </div>
                  <div className="pr-3">
                    <ScheduleIcon
                      size={20}
                      className="[&_path]:stroke-gray-50"
                    />
                  </div>
                </div>

                <input
                  ref={dateInputRef}
                  type="date"
                  id="acquired-date"
                  value={acquiredDate}
                  onChange={e => setAcquiredDate(e.target.value)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                  max={today}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="notes"
                className="mb-1 block text-sm font-medium text-gray-50">
                메모
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="특이사항이나 관리 방법 등을 적어주세요"
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
                rows={3}
              />
            </div>
          </div>

          {/* 등록 버튼 */}
          <div className="mt-6 mb-8">
            <button
              type="submit"
              className="w-full rounded-md bg-green-600 py-3 text-center text-white hover:bg-green-700">
              식물 등록하기
            </button>
          </div>
        </form>
      </ContentsLayout>
    </>
  );
}
