'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ARTICLE_CATEGORIES,
  ArticleCategory
} from '@/app/_constants/categories';
import { useImageUpload } from '@/app/_hooks/useImageUpload';
import { Input, Textarea, LoadingOverlay } from '@/app/_components/common';
import { ImageUploader } from '@/app/_components/common/ImageUploader';
import ArticleEditor from './ArticleEditor';
import KeywordsField from './KeywordsField';
import SubmitButtons from './SubmitButtons';
import { createArticle, updateArticle } from '@/app/actions/articles';

interface ArticleData {
  id: number;
  title: string;
  content: string;
  summary?: string;
  tags: string[];
  image?: string;
  category: {
    id: string;
    name: string;
  };
}

interface ArticleUploadFormProps {
  mode?: 'create' | 'edit';
  initialData?: ArticleData;
}

export default function ArticleUploadForm({
  mode = 'create',
  initialData
}: ArticleUploadFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 기본값 설정 - mode에 따라 다르게
  const getDefaultValues = () => {
    if (mode === 'edit' && initialData) {
      return {
        title: initialData.title,
        content: initialData.content,
        summary: initialData.summary || '',
        keywords: initialData.tags?.join(', ') || '',
        categoryId: initialData.category?.id || ''
      };
    }

    // create mode 기본값
    return {
      title: '',
      content: '',
      summary: '',
      keywords: '',
      categoryId: ''
    };
  };

  const defaultValues = getDefaultValues();

  // 폼 상태 관리
  const [title, setTitle] = useState(defaultValues.title);
  const [editorContent, setEditorContent] = useState(defaultValues.content);
  const [summary, setSummary] = useState(defaultValues.summary);
  const [keywords, setKeywords] = useState(defaultValues.keywords);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    defaultValues.categoryId
  );

  // 이미지 업로드 훅 사용 - 편집 모드일 때 초기 이미지 설정
  const { imageFile, imagePreview, handleSingleImageChange } = useImageUpload({
    maxFiles: 1,
    onError: message => alert(message),
    initialImage: initialData?.image || null
  });

  // 초기 카테고리 설정
  useEffect(() => {
    // 편집 모드가 아니고 초기 데이터가 없을 때만 첫 번째 카테고리 선택
    if (mode === 'create' && !initialData && ARTICLE_CATEGORIES.length > 0) {
      setSelectedCategoryId(ARTICLE_CATEGORIES[0].id);
    }
  }, [mode, initialData]);

  // 키워드 처리 함수
  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeywords(e.target.value);
  };

  // 키워드를 배열로 변환하는 함수
  const getKeywordsArray = (): string[] => {
    if (!keywords) return [];
    return keywords
      .split(',')
      .map(word => word.trim())
      .filter(word => word !== '');
  };

  // 에디터 내용 변경 핸들러
  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  // 편집 모드에서 초기 데이터로 상태 초기화
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setTitle(initialData.title);
      setEditorContent(initialData.content);
      setSummary(initialData.summary || '');
      setKeywords(initialData.tags?.join(', ') || '');
      setSelectedCategoryId(initialData.category?.id || '');
    }
  }, [mode, initialData]);

  // mode에 따른 텍스트 설정
  const texts = {
    title: {
      create: '식물 뉴스 작성',
      edit: '식물 뉴스 수정'
    },
    submitButton: {
      create: { idle: '작성 완료', loading: '작성 중...' },
      edit: { idle: '수정 완료', loading: '수정 중...' }
    },
    validation: {
      create: '제목, 내용, 카테고리, 대표 이미지는 필수 항목입니다.',
      edit: '제목, 내용, 카테고리는 필수 항목입니다.'
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 편집 모드에서는 이미지가 필수가 아님 (기존 이미지 유지 가능)
    const isImageRequired = mode === 'create';

    if (
      !title ||
      !editorContent ||
      !selectedCategoryId ||
      (isImageRequired && !imageFile)
    ) {
      alert(texts.validation[mode]);
      return;
    }

    setIsSubmitting(true);

    try {
      // FormData 생성
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', editorContent);
      formData.append('summary', summary);
      formData.append('categoryId', selectedCategoryId);

      // 디버깅: 전송하는 content 확인
      console.log('전송하는 editorContent:', editorContent);

      // 새 이미지가 있을 때만 추가
      if (imageFile) {
        formData.append('thumbnail', imageFile);
      }

      const keywordsArray = getKeywordsArray();
      if (keywordsArray.length > 0) {
        formData.append('tags', JSON.stringify(keywordsArray));
      }

      // mode에 따라 다른 서버 액션 호출
      let result;
      if (mode === 'edit' && initialData) {
        result = await updateArticle(initialData.id, formData);
      } else {
        result = await createArticle(formData);
      }

      if (result.success) {
        // 성공 시 리다이렉트
        router.push(result.redirectTo!);
      } else {
        // 실패 시 에러 메시지 표시
        alert(result.error || '작업에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('기사 처리 실패:', error);
      alert(
        error instanceof Error
          ? error.message
          : '기사 처리에 실패했습니다. 다시 시도해주세요.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <LoadingOverlay
        isVisible={isSubmitting}
        message={
          mode === 'edit'
            ? '기사를 수정하고 있어요...'
            : '기사를 작성하고 있어요...'
        }
        description={
          mode === 'edit'
            ? '변경사항을 저장하고 있습니다.'
            : '새로운 기사를 발행하고 있어요!'
        }
      />

      <div className="mx-auto w-full max-w-4xl py-4">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 text-gray-50">
          {/* 썸네일 이미지 업로드 */}
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-medium text-gray-50">
              대표 이미지 (썸네일)
            </h2>
            <ImageUploader
              imagePreview={imagePreview}
              onImageChange={handleSingleImageChange}
              label="대표 이미지"
              required={true}
              aspectRatio="landscape"
              placeholder="클릭하여 대표 이미지 업로드"
              infoText="JPG, PNG, WebP 형식 (최대 5MB)"
            />
          </div>

          {/* 제목 */}
          <Input
            id="title"
            type="text"
            label="제목"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            required
            className="p-3 text-lg"
          />

          {/* 요약 */}
          <Textarea
            id="summary"
            label="요약 (선택사항)"
            value={summary}
            onChange={e => setSummary(e.target.value)}
            placeholder="기사 요약을 입력하세요"
            rows={3}
          />

          {/* 카테고리 선택 */}
          <div className="space-y-2">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-50">
              카테고리 <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              value={selectedCategoryId}
              onChange={e => setSelectedCategoryId(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-gray-50 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
              required>
              <option
                value=""
                className="text-gray-800">
                카테고리를 선택하세요
              </option>
              {ARTICLE_CATEGORIES.map((category: ArticleCategory) => (
                <option
                  key={category.id}
                  value={category.id}
                  className="text-black">
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* 키워드 */}
          <KeywordsField
            keywords={keywords}
            onChange={handleKeywordsChange}
            keywordsArray={getKeywordsArray()}
          />

          {/* 리치 텍스트 에디터 */}
          <ArticleEditor
            key={initialData?.id || 'new'}
            onChange={handleEditorChange}
            initialContent={editorContent}
            showError={editorContent === ''}
          />

          {/* 제출 버튼 */}
          <SubmitButtons
            onCancel={() => router.back()}
            isLoading={isSubmitting}
          />
        </form>
      </div>
    </>
  );
}
