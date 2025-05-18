'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUploader } from '@/app/_components/common/ImageUploader';
import KeywordsField from './KeywordsField';
import SubmitButtons from './SubmitButtons';
import ArticleEditor from './ArticleEditor';

export default function ArticleUploadForm() {
  const router = useRouter();
  const isAdmin = true; // 실제로는 useAuth() 등을 사용하여 권한 체크
  const [isLoading, setIsLoading] = useState(true);

  // 폼 상태 관리
  const [title, setTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [author, setAuthor] = useState('');
  const [keywords, setKeywords] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // 관리자 체크 로직
  useEffect(() => {
    // 실제 구현에서는 서버에서 관리자 권한 확인
    const checkAdmin = () => {
      // 개발 목적으로 로딩 시뮬레이션
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    checkAdmin();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !editorContent || !thumbnailFile) {
      alert('제목, 내용, 대표 이미지는 필수 항목입니다.');
      return;
    }

    setIsLoading(true);

    try {
      // 폼 데이터 구성
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', editorContent);
      formData.append('author', author || '익명');

      // 키워드 추가
      const keywordsArray = getKeywordsArray();
      if (keywordsArray.length > 0) {
        formData.append('tags', JSON.stringify(keywordsArray));
      }

      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }

      // API 호출
      const response = await fetch('/api/articles', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '글 등록에 실패했습니다.');
      }

      // 성공 시 글 목록 페이지로 이동
      alert('기사가 성공적으로 등록되었습니다.');
      router.push('/articles');
      router.refresh(); // 새로운 데이터 반영을 위한 새로고침
    } catch (error) {
      console.error('기사 등록 실패:', error);
      alert(
        error instanceof Error
          ? error.message
          : '기사 등록에 실패했습니다. 다시 시도해주세요.'
      );
    } finally {
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

        {/* 작성자 */}
        <div className="space-y-2">
          <label
            htmlFor="author"
            className="block text-sm font-medium text-gray-50">
            작성자 <span className="text-xs text-gray-400">(선택사항)</span>
          </label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
            placeholder="작성자명 (입력하지 않으면 '익명'으로 표시)"
          />
        </div>

        {/* 키워드 */}
        <KeywordsField
          keywords={keywords}
          onChange={handleKeywordsChange}
          keywordsArray={getKeywordsArray()}
        />

        {/* 리치 텍스트 에디터 */}
        <ArticleEditor
          onChange={handleEditorChange}
          initialContent=""
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
