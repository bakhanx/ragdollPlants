import { z } from 'zod';
import { PLANT_CATEGORIES } from '@/app/_constants/plantData';

/**
 * 식물 등록 폼 스키마
 */
export const plantUploadSchema = z.object({
  plantName: z
    .string()
    .min(1, '식물 이름을 입력해주세요')
    .max(50, '식물 이름은 50자 이하로 입력해주세요'),
  
  plantType: z
    .enum(PLANT_CATEGORIES as [string, ...string[]], {
      errorMap: () => ({ message: '식물 종류를 선택해주세요' })
    }),
  
  location: z
    .string()
    .max(100, '위치는 100자 이하로 입력해주세요')
    .optional()
    .or(z.literal('')),
  
  acquiredDate: z
    .string()
    .min(1, '입양일을 선택해주세요')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // 오늘까지 허용
      return selectedDate <= today;
    }, '입양일은 오늘 이전이어야 합니다'),
  
  notes: z
    .string()
    .max(500, '메모는 500자 이하로 입력해주세요')
    .optional()
    .or(z.literal('')),
  
  wateringInterval: z
    .number()
    .min(1, '물주기 간격은 1일 이상이어야 합니다')
    .max(365, '물주기 간격은 365일 이하여야 합니다'),
  
  nutrientInterval: z
    .number()
    .min(1, '영양제 간격은 1일 이상이어야 합니다')
    .max(365, '영양제 간격은 365일 이하여야 합니다'),
  
  image: z
    .any()
    .optional()
    .refine((file) => {
      if (!file) return true; // 이미지는 선택사항
      return file instanceof File;
    }, '올바른 이미지 파일을 선택해주세요')
    .refine((file) => {
      if (!file) return true;
      return file.size <= 5 * 1024 * 1024; // 5MB 제한
    }, '이미지 크기는 5MB 이하여야 합니다')
    .refine((file) => {
      if (!file) return true;
      return ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
    }, '지원되는 이미지 형식: JPG, PNG, WebP')
});

export type PlantUploadFormData = z.infer<typeof plantUploadSchema>; 