'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUploader } from '@/app/_components/common/ImageUploader';
import PlantTypeSelector from '@/app/myplants/upload/_components/PlantTypeSelector';
import DatePickerField from '@/app/myplants/upload/_components/DatePickerField';

interface PlantTypeOption {
  value: string;
  label: string;
}

interface PlantUploadFormProps {
  plantTypeOptions: PlantTypeOption[];
}

export const PlantUploadForm = ({ plantTypeOptions }: PlantUploadFormProps) => {
  const router = useRouter();

  // 폼 상태 관리 - useState 사용
  const [plantName, setPlantName] = useState('');
  const [plantType, setPlantType] = useState(plantTypeOptions[0].value);
  const [location, setLocation] = useState('');
  const [acquiredDate, setAcquiredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 이미지 상태 관리
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 오늘 날짜 계산
  const today = new Date().toISOString().split('T')[0];

  // 이미지 변경 핸들러
  const handleImageChange = (file: File | null) => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview); // 메모리 누수 방지
    }

    setImageFile(file);

    if (file) {
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    } else {
      setImagePreview(null);
    }
  };

  // 클린업 함수
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview); // 컴포넌트 언마운트 시 URL 객체 해제
      }
    };
  }, [imagePreview]);

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!plantName.trim()) {
      newErrors.plantName = '식물 이름을 입력해주세요';
    }

    if (!plantType) {
      newErrors.plantType = '식물 종류를 선택해주세요';
    }

    if (!acquiredDate) {
      newErrors.acquiredDate = '입양일을 선택해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출 처리 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // API 요청 데이터 준비
      const formData = new FormData();
      if (imageFile) {
        formData.append('image', imageFile);
      }

      // 폼 데이터 추가
      formData.append('plantName', plantName);
      formData.append('plantType', plantType);
      formData.append('location', location);
      formData.append('acquiredDate', acquiredDate);
      formData.append('notes', notes);

      // API 호출을 시뮬레이션 (실제로는 fetch 등으로 서버에 데이터 전송)
      console.log('폼 데이터 제출:', {
        plantName,
        plantType,
        location,
        acquiredDate,
        notes,
        imageFile: imageFile
          ? `${imageFile.name} (${imageFile.size} bytes)`
          : null
      });

      // 성공 시 목록 페이지로 이동
      router.push('/myplants');
    } catch (error) {
      console.error('식물 등록 중 오류 발생:', error);
      alert('식물 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 식물 이름 입력 핸들러
  const handlePlantNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlantName(e.target.value);
    if (errors.plantName && e.target.value.trim()) {
      setErrors(prev => ({ ...prev, plantName: '' }));
    }
  };

  // 식물 종류 선택 핸들러
  const handlePlantTypeChange = (value: string) => {
    setPlantType(value);
    if (errors.plantType) {
      setErrors(prev => ({ ...prev, plantType: '' }));
    }
  };

  // 입양일 선택 핸들러
  const handleAcquiredDateChange = (value: string) => {
    setAcquiredDate(value);
    if (errors.acquiredDate) {
      setErrors(prev => ({ ...prev, acquiredDate: '' }));
    }
  };

  return (
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
            onChange={handlePlantNameChange}
            required
            placeholder="예) 몬스테라, 산세베리아"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
          />
          {errors.plantName && (
            <p className="mt-1 text-xs text-red-500">{errors.plantName}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-50">
            식물 종류 <span className="text-red-500">*</span>
          </label>
          <PlantTypeSelector
            options={plantTypeOptions}
            value={plantType}
            onChange={handlePlantTypeChange}
          />
          {errors.plantType && (
            <p className="mt-1 text-xs text-red-500">{errors.plantType}</p>
          )}
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
          <DatePickerField
            value={acquiredDate}
            onChange={handleAcquiredDateChange}
            max={today}
          />
          {errors.acquiredDate && (
            <p className="mt-1 text-xs text-red-500">{errors.acquiredDate}</p>
          )}
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
          disabled={isSubmitting}
          className="w-full rounded-md bg-green-600 py-3 text-center text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400">
          {isSubmitting ? '등록 중...' : '식물 등록하기'}
        </button>
      </div>
    </form>
  );
};
