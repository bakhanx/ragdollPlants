'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageUploader } from '@/app/_components/common/ImageUploader';
import PlantTypeSelector from '@/app/myplants/upload/_components/PlantTypeSelector';
import DatePickerField from '@/app/myplants/upload/_components/DatePickerField';
import { createPlant } from '@/app/actions/plants';
import { plantUploadSchema, type PlantUploadFormData } from '@/lib/validations/plant';
import { 
  PLANT_TYPE_OPTIONS,
  DEFAULT_WATERING_INTERVAL,
  DEFAULT_NUTRIENT_INTERVAL
} from '@/app/_constants/plantData';

export const PlantUploadForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 오늘 날짜 계산
  const today = new Date().toISOString().split('T')[0];

  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<PlantUploadFormData>({
    resolver: zodResolver(plantUploadSchema),
    defaultValues: {
      plantName: '',
      plantType: PLANT_TYPE_OPTIONS[0].value,
      location: '',
      acquiredDate: '',
      notes: '',
      wateringInterval: DEFAULT_WATERING_INTERVAL,
      nutrientInterval: DEFAULT_NUTRIENT_INTERVAL
    }
  });

  // 현재 선택된 값들 추적
  const plantType = watch('plantType');

  // 이미지 변경 핸들러
  const handleImageChange = (file: File | null) => {
    // 이전 미리보기 URL 정리
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    if (file) {
      // 폼에 파일 설정
      setValue('image', file);
      
      // 미리보기 생성
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    } else {
      setValue('image', undefined);
      setImagePreview(null);
    }
  };

  // 폼 제출 핸들러
  const onSubmit = async (data: PlantUploadFormData) => {
    setIsSubmitting(true);

    try {
      // FormData 생성
      const formData = new FormData();

      // 이미지 처리 - Cloudflare Images용
      if (data.image) {
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

      // 서버 액션 호출
      const result = await createPlant(formData);

      if (result.success) {
        // 성공 시 목록 페이지로 이동
        router.push('/myplants');
      } else {
        alert(result.message || '식물 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('식물 등록 중 오류 발생:', error);
      alert('식물 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 w-full">
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
          <p className="mt-1 text-xs text-red-500">{errors.image.message as string}</p>
        )}
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
            {...register('plantName')}
            placeholder="예) 몬스테라, 산세베리아"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-white placeholder:text-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
          />
          {errors.plantName && (
            <p className="mt-1 text-xs text-red-500">{errors.plantName.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-50">
            식물 종류 <span className="text-red-500">*</span>
          </label>
          <PlantTypeSelector
            options={PLANT_TYPE_OPTIONS}
            value={plantType}
            onChange={(value) => setValue('plantType', value)}
          />
          {errors.plantType && (
            <p className="mt-1 text-xs text-red-500">{errors.plantType.message}</p>
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
            {...register('location')}
            placeholder="예) 거실 창가, 베란다"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-white placeholder:text-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
          />
          {errors.location && (
            <p className="mt-1 text-xs text-red-500">{errors.location.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="acquired-date"
            className="mb-1 block text-sm font-medium text-gray-50">
            입양일 <span className="text-red-500">*</span>
          </label>
          <DatePickerField
            value={watch('acquiredDate')}
            onChange={(value) => setValue('acquiredDate', value)}
            max={today}
          />
          {errors.acquiredDate && (
            <p className="mt-1 text-xs text-red-500">{errors.acquiredDate.message}</p>
          )}
        </div>

        {/* 케어 주기 설정 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="watering-interval"
              className="mb-1 block text-sm font-medium text-gray-50">
              물주기 주기 (일)
            </label>
            <input
              id="watering-interval"
              type="number"
              min="1"
              max="365"
              {...register('wateringInterval', { valueAsNumber: true })}
              placeholder="7"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-white placeholder:text-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-400">일반적으로 7-14일</p>
            {errors.wateringInterval && (
              <p className="mt-1 text-xs text-red-500">{errors.wateringInterval.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="nutrient-interval"
              className="mb-1 block text-sm font-medium text-gray-50">
              영양제 주기 (일)
            </label>
            <input
              id="nutrient-interval"
              type="number"
              min="1"
              max="365"
              {...register('nutrientInterval', { valueAsNumber: true })}
              placeholder="30"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-white placeholder:text-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-400">일반적으로 30일</p>
            {errors.nutrientInterval && (
              <p className="mt-1 text-xs text-red-500">{errors.nutrientInterval.message}</p>
            )}
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
            {...register('notes')}
            placeholder="특이사항이나 관리 방법 등을 적어주세요"
            className="w-full rounded-md border border-gray-300 p-2 text-sm text-white placeholder:text-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
            rows={3}
          />
          {errors.notes && (
            <p className="mt-1 text-xs text-red-500">{errors.notes.message}</p>
          )}
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
