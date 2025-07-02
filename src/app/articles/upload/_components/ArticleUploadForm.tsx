'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUploader } from '@/app/_components/common/ImageUploader';
import KeywordsField from './KeywordsField';
import SubmitButtons from './SubmitButtons';
import ArticleEditor from './ArticleEditor';
import {
  createArticle,
  getCategories,
  updateArticle
} from '@/app/actions/articles';

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
  const isAdmin = true; // 실제로는 useAuth() 등을 사용하여 권한 체크
  const [isLoading, setIsLoading] = useState(true);

  // 기본값 설정 - mode에 따라 다르게
  const getDefaultValues = () => {
    if (mode === 'edit' && initialData) {
      return {
        title: initialData.title,
        content: initialData.content,
        summary: initialData.summary || '',
        keywords: initialData.tags?.join(', ') || '',
        thumbnailPreview: initialData.image || null,
        categoryId: initialData.category?.id || ''
      };
    }

    // create mode 기본값
    return {
      title: '',
      content: '',
      summary: '',
      keywords: '',
      thumbnailPreview: null,
      categoryId: ''
    };
  };

  const defaultValues = getDefaultValues();

  // 폼 상태 관리
  const [title, setTitle] = useState(defaultValues.title);
  const [editorContent, setEditorContent] = useState(defaultValues.content);
  const [summary, setSummary] = useState(defaultValues.summary);
  const [keywords, setKeywords] = useState(defaultValues.keywords);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    defaultValues.thumbnailPreview
  );
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    defaultValues.categoryId
  );

  // 관리자 체크 및 카테고리 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        // 편집 모드가 아니고 초기 데이터가 없을 때만 첫 번째 카테고리 선택
        if (mode === 'create' && !initialData && categoriesData.length > 0) {
          setSelectedCategoryId(categoriesData[0].id);
        }
      } catch (error) {
        console.error('카테고리 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 썸네일 이미지 변경 핸들러
  const handleThumbnailChange = (file: File | null) => {
    setThumbnailFile(file);

    if (file) {
      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setThumbnailPreview(null);
    }
  };

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
      setThumbnailPreview(initialData.image || null);
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
      (isImageRequired && !thumbnailFile)
    ) {
      alert(texts.validation[mode]);
      return;
    }

    setIsLoading(true);

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
      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }

      const keywordsArray = getKeywordsArray();
      if (keywordsArray.length > 0) {
        formData.append('tags', JSON.stringify(keywordsArray));
      }

      // mode에 따라 다른 서버 액션 호출
      if (mode === 'edit' && initialData) {
        await updateArticle(initialData.id, formData);
      } else {
        await createArticle(formData);
      }
      // 성공 시 여기까지 도달하지 않음 (redirect 발생)
    } catch (error) {
      console.error('기사 등록 실패:', error);

      // NEXT_REDIRECT 에러는 정상적인 리다이렉트이므로 사용자에게 보여주지 않음
      const errorString = String(error);
      if (errorString.includes('NEXT_REDIRECT')) {
        return; // 정상적인 리다이렉트이므로 아무것도 하지 않음
      }

      // 실제 에러만 사용자에게 표시
      alert(
        error instanceof Error
          ? error.message
          : '기사 등록에 실패했습니다. 다시 시도해주세요.'
      );
      setIsLoading(false);
    }
  };

  // 로딩 중이거나 관리자가 아니면 컴포넌트에서 처리하지 않음
  if (isLoading || !isAdmin) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-4xl py-4">
      <form
        onSubmit={handleSubmit}
        className="space-y-6">
        {/* 썸네일 이미지 업로드 */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-medium text-gray-50">
            대표 이미지 (썸네일)
          </h2>
          <ImageUploader
            imagePreview={thumbnailPreview}
            onImageChange={handleThumbnailChange}
            label="대표 이미지"
            required={true}
            aspectRatio="landscape"
            placeholder="클릭하여 대표 이미지 업로드"
            infoText="JPG, PNG, WebP 형식 (최대 5MB)"
          />
        </div>

        {/* 제목 */}
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-lg font-medium text-gray-50">
            제목 <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-3 text-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
            placeholder="제목을 입력하세요"
            required
          />
        </div>

        {/* 요약 */}
        <div className="space-y-2">
          <label
            htmlFor="summary"
            className="block text-sm font-medium text-gray-50">
            요약 <span className="text-xs text-gray-400">(선택사항)</span>
          </label>
          <textarea
            id="summary"
            value={summary}
            onChange={e => setSummary(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
            placeholder="기사 요약을 입력하세요"
            rows={3}
          />
        </div>

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
            className="w-full rounded-md border border-gray-300 p-2 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
            required>
            <option value="">카테고리를 선택하세요</option>
            {categories.map(category => (
              <option
                key={category.id}
                value={category.id}>
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
          isLoading={isLoading}
        />
      </form>
    </div>
  );
}
