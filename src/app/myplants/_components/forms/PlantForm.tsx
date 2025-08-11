'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useImageUpload } from '@/app/_hooks/useImageUpload';
import { Input, Textarea, LoadingOverlay } from '@/app/_components/common';
import { ImageUploader } from '@/app/_components/common/ImageUploader';
import PlantTypeSelector from './PlantTypeSelector';
import DatePickerField from './DatePickerField';
import { createPlant, updatePlant } from '@/app/actions/plants';
import {
  plantUploadSchema,
  type PlantUploadFormData
} from '@/lib/validations/plant';
import {
  PLANT_TYPE_OPTIONS,
  DEFAULT_WATERING_INTERVAL,
  DEFAULT_NUTRIENT_INTERVAL
} from '@/app/_constants/plantData';

// 식물 데이터 타입 (편집 시 초기값용)
interface PlantData {
  id: string;
  name: string;
  image: string;
  category: string;
  description: string | null;
  location: string | null;
  purchaseDate: string | null;
  wateringInterval: number;
  nutrientInterval: number;
}

// PlantForm Props 타입
interface PlantFormProps {
  mode: 'create' | 'edit';
  initialData?: PlantData;
}

export const PlantForm = ({ mode, initialData }: PlantFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 이미지 업로드 훅 사용 - 편집 모드일 때 초기 이미지 설정
  const { imageFile, imagePreview, handleSingleImageChange } = useImageUpload({
    maxFiles: 1,
    onError: message => alert(message),
    initialImage: initialData?.image || null
  });

  // 오늘 날짜 계산
  const today = new Date().toISOString().split('T')[0];

  // 기본값 설정 - mode에 따라 다르게
  const getDefaultValues = (): PlantUploadFormData => {
    if (mode === 'edit' && initialData) {
      return {
        plantName: initialData.name,
        plantType: initialData.category,
        location: initialData.location || '',
        acquiredDate: initialData.purchaseDate
          ? initialData.purchaseDate.split('T')[0]
          : '',
        notes: initialData.description || '',
        wateringInterval: initialData.wateringInterval,
        nutrientInterval: initialData.nutrientInterval
      };
    }

    // create mode 기본값
    return {
      plantName: '',
      plantType: PLANT_TYPE_OPTIONS[0].value,
      location: '',
      acquiredDate: '',
      notes: '',
      wateringInterval: DEFAULT_WATERING_INTERVAL,
      nutrientInterval: DEFAULT_NUTRIENT_INTERVAL
    };
  };

  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<PlantUploadFormData>({
    resolver: zodResolver(plantUploadSchema),
    defaultValues: getDefaultValues()
  });

  // 현재 선택된 값들 추적
  const plantType = watch('plantType');

  // 이미지 변경 핸들러 - 훅의 핸들러와 폼 설정을 연결
  const handleImageChange = (file: File | null) => {
    // 훅의 핸들러 호출
    handleSingleImageChange(file);

    // 폼에 파일 설정
    setValue('image', file || undefined);
  };

  // 폼 제출 핸들러
  const onSubmit = async (data: PlantUploadFormData) => {
    setIsSubmitting(true);

    try {
      // FormData 생성
      const formData = new FormData();

      // 이미지 처리 - 훅에서 관리하는 파일 사용
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (data.image) {
        formData.append('image', data.image);
      }

      // 다른 폼 데이터 추가
      formData.append('plantName', data.plantName);
      formData.append('plantType', data.plantType);
      formData.append('location', data.location || '');
      formData.append('acquiredDate', data.acquiredDate);
      formData.append('notes', data.notes || '');
      formData.append('wateringInterval', data.wateringInterval.toString());
      formData.append('nutrientInterval', data.nutrientInterval.toString());

      // mode에 따라 다른 서버 액션 호출
      let result;
      if (mode === 'create') {
        result = await createPlant(formData);
      } else {
        result = await updatePlant(initialData!.id, formData);
      }

      if (result.success) {
        router.push(result.redirectTo!);
      } else {
        const actionText = mode === 'create' ? '등록' : '수정';
        alert(result.message || `식물 ${actionText}에 실패했습니다.`);
      }
    } catch (error) {
      const actionText = mode === 'create' ? '등록' : '수정';
      console.error(`식물 ${actionText} 중 오류 발생:`, error);
      alert(`식물 ${actionText}에 실패했습니다. 다시 시도해주세요.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // mode에 따른 텍스트 설정
  const texts = {
    submitButton: {
      create: { idle: '식물 등록하기', loading: '등록 중...' },
      edit: { idle: '수정 완료', loading: '수정 중...' }
    }
  };

  return (
    <>
      <LoadingOverlay
        isVisible={isSubmitting}
        message={
          mode === 'create'
            ? '식물을 등록하고 있어요...'
            : '식물 정보를 수정하고 있어요...'
        }
        description={
          mode === 'create'
            ? '잠시만 기다려주세요!'
            : '변경사항을 저장하고 있습니다.'
        }
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
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
          {errors.image && (
            <p className="mt-1 text-xs text-red-500">
              {errors.image.message as string}
            </p>
          )}
        </div>

        {/* 기본 정보 폼 */}
        <div className="space-y-4">
          <Input
            id="plant-name"
            type="text"
            label="식물 이름"
            required
            placeholder="예) 몬스테라, 산세베리아"
            {...register('plantName')}
            error={errors.plantName?.message}
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-50">
              식물 종류 <span className="text-red-500">*</span>
            </label>
            <PlantTypeSelector
              options={PLANT_TYPE_OPTIONS}
              value={plantType}
              onChange={value => setValue('plantType', value)}
            />
            {errors.plantType && (
              <p className="mt-1 text-xs text-red-500">
                {errors.plantType.message}
              </p>
            )}
          </div>

          <Input
            id="location"
            type="text"
            label="위치"
            placeholder="예) 거실 창가, 베란다"
            {...register('location')}
            error={errors.location?.message}
          />

          <div>
            <label
              htmlFor="acquired-date"
              className="mb-1 block text-sm font-medium text-gray-50">
              입양일 <span className="text-red-500">*</span>
            </label>
            <DatePickerField
              value={watch('acquiredDate')}
              onChange={value => setValue('acquiredDate', value)}
              max={today}
            />
            {errors.acquiredDate && (
              <p className="mt-1 text-xs text-red-500">
                {errors.acquiredDate.message}
              </p>
            )}
          </div>

          {/* 케어 주기 설정 */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="watering-interval"
              type="number"
              label="물주기 주기 (일)"
              min="1"
              max="365"
              placeholder="7"
              helpText="일반적으로 7-14일"
              {...register('wateringInterval', { valueAsNumber: true })}
              error={errors.wateringInterval?.message}
            />

            <Input
              id="nutrient-interval"
              type="number"
              label="영양제 주기 (일)"
              min="1"
              max="365"
              placeholder="30"
              helpText="일반적으로 30일"
              {...register('nutrientInterval', { valueAsNumber: true })}
              error={errors.nutrientInterval?.message}
            />
          </div>

          <Textarea
            id="notes"
            label="메모"
            placeholder="특이사항이나 관리 방법 등을 적어주세요"
            rows={3}
            {...register('notes')}
            error={errors.notes?.message}
          />
        </div>

        {/* 버튼 섹션 - mode에 따라 다름 */}
        <div className="mt-6 mb-8">
          {mode === 'edit' ? (
            // 편집 모드
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-md bg-green-600 py-3 text-center text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400">
                {isSubmitting
                  ? texts.submitButton[mode].loading
                  : texts.submitButton[mode].idle}
              </button>
            </div>
          ) : (
            // 등록 모드
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-green-600 py-3 text-center text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400">
              {isSubmitting
                ? texts.submitButton[mode].loading
                : texts.submitButton[mode].idle}
            </button>
          )}
        </div>
      </form>
    </>
  );
};
