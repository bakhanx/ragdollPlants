'use client';

import { useState, useCallback } from 'react';

type UseImageUploadOptions = {
  maxFileSize?: number;
  maxFiles?: number;
  onError?: (message: string) => void;
  initialImage?: string | null; // 단일 이미지
  initialImages?: string[]; // 다중 이미지
};

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const {
    maxFileSize = 5 * 1024 * 1024, // 기본 5MB
    maxFiles = 10,
    onError = (message: string) => alert(message),
    initialImage = null,
    initialImages = []
  } = options;

  // 단일 이미지 상태
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialImage);

  // 다중 이미지 상태
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(initialImages);

  // 파일 크기 체크 유틸리티 함수
  const checkFileSize = useCallback(
    (file: File): boolean => {
      if (file.size > maxFileSize) {
        onError(
          `파일 크기는 ${maxFileSize / (1024 * 1024)}MB 이하여야 합니다.`
        );
        return false;
      }
      return true;
    },
    [maxFileSize, onError]
  );

  // 파일을 미리보기 URL로 변환하는 유틸리티 함수
  const createPreview = useCallback((file: File): Promise<string> => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }, []);

  // 단일 이미지 핸들러
  const handleSingleImageChange = useCallback(
    async (file: File | null) => {
      if (file) {
        if (!checkFileSize(file)) return;

        try {
          const preview = await createPreview(file);
          setImageFile(file);
          setImagePreview(preview);
        } catch (error) {
          console.error('이미지 미리보기 생성 실패:', error);
          onError('이미지 처리 중 오류가 발생했습니다.');
        }
      } else {
        setImageFile(null);
        setImagePreview(null);
      }
    },
    [checkFileSize, createPreview, onError]
  );

  // 다중 이미지 핸들러
  const handleMultiImageChange = useCallback(
    async (file: File | null, index: number) => {
      // 파일이 없는 경우 (삭제 상황)
      if (!file) {
        // 삭제하는 경우 - 해당 인덱스의 항목만 제거하고 배열을 재정렬
        const newFiles = [...imageFiles];
        const newPreviews = [...imagePreviews];

        // 해당 인덱스의 파일과 미리보기 제거
        newFiles.splice(index, 1);
        newPreviews.splice(index, 1);

        setImageFiles(newFiles);
        setImagePreviews(newPreviews);
        return;
      }

      // 파일 크기 체크
      if (!checkFileSize(file)) return;

      // 최대 파일 개수 체크
      if (imageFiles.length >= maxFiles) {
        onError(`최대 ${maxFiles}개의 이미지만 업로드할 수 있습니다.`);
        return;
      }

      try {
        const preview = await createPreview(file);

        // 새 이미지 추가 - 클릭한 인덱스와 상관없이 항상 배열 끝에 추가
        if (index === imageFiles.length) {
          // 다음 빈 슬롯에 추가 (정상적인 순차 추가)
          setImageFiles([...imageFiles, file]);
          setImagePreviews([...imagePreviews, preview]);
        } else if (index < imageFiles.length) {
          // 이미 이미지가 있는 슬롯 클릭 시 해당 이미지 업데이트
          const newFiles = [...imageFiles];
          const newPreviews = [...imagePreviews];
          newFiles[index] = file;
          newPreviews[index] = preview;
          setImageFiles(newFiles);
          setImagePreviews(newPreviews);
        } else {
          // 빈 공간을 건너뛰어 클릭한 경우 (예: 3번째 슬롯을 클릭했지만 0, 1번 슬롯만 채워져 있을 때)
          // 항상 다음 빈 슬롯(imageFiles.length)에 추가
          setImageFiles([...imageFiles, file]);
          setImagePreviews([...imagePreviews, preview]);
        }
      } catch (error) {
        console.error('이미지 미리보기 생성 실패:', error);
        onError('이미지 처리 중 오류가 발생했습니다.');
      }
    },
    [imageFiles, imagePreviews, maxFiles, checkFileSize, createPreview, onError]
  );

  // 모든 이미지 초기화
  const resetImages = useCallback(() => {
    // 단일 이미지 초기화
    setImageFile(null);
    setImagePreview(null);

    // 다중 이미지 초기화
    setImageFiles([]);
    setImagePreviews([]);
  }, []);

  return {
    // 단일 이미지 관련
    imageFile,
    imagePreview,
    handleSingleImageChange,

    // 다중 이미지 관련
    imageFiles,
    imagePreviews,
    handleMultiImageChange,

    // 유틸리티
    resetImages
  };
}
