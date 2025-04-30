'use client';

import React, { useState, useEffect } from 'react';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import { useRouter } from 'next/navigation';
import { ImageUploader } from '@/app/_components/common/ImageUploader';
import dynamic from 'next/dynamic';

// 에디터는 클라이언트 사이드에서만 로드하도록 dynamic import 사용
const RichTextEditor = dynamic(
  () => import('@/app/_components/common/editor/RichTextEditor'),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 w-full animate-pulse rounded-md bg-gray-200"></div>
    )
  }
);

export default function UploadArticlePage() {
  const router = useRouter();
  //   const { isAdmin } = useAuth();
  const isAdmin = true;
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

  // 관리자가 아니거나 로딩 중이면 접근 불가 메시지 표시
  if (isLoading) {
    return (
      <>
        <BackgroundImage src="/images/welcome-bg-06.webp" />
        <ContentsLayout>
          <Header
            title="식물 뉴스 작성"
            showBack={true}
          />
          <div className="flex h-[80vh] items-center justify-center">
            <p className="text-center text-lg">로딩 중...</p>
          </div>
        </ContentsLayout>
      </>
    );
  }

  if (!isAdmin) {
    return (
      <>
        <BackgroundImage src="/images/welcome-bg-06.webp" />
        <ContentsLayout>
          <Header
            title="식물 뉴스 작성"
            showBack={true}
          />
          <div className="flex h-[80vh] items-center justify-center">
            <p className="text-center text-lg">
              관리자만 접근할 수 있는 페이지입니다.
            </p>
          </div>
        </ContentsLayout>
      </>
    );
  }

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-04.webp" />
      <ContentsLayout showFooter={false}>
        <Header
          title="식물 뉴스 작성"
          showBack={true}
        />

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
            <div className="space-y-2">
              <label
                htmlFor="keywords"
                className="block text-sm font-medium text-gray-50">
                키워드{' '}
                <span className="text-xs text-gray-400">
                  (선택사항, 쉼표로 구분)
                </span>
              </label>
              <input
                id="keywords"
                type="text"
                value={keywords}
                onChange={handleKeywordsChange}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
                placeholder="예: 식물관리, 분갈이, 햇빛"
              />
              {getKeywordsArray().length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {getKeywordsArray().map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 리치 텍스트 에디터 */}
            <div className="space-y-2">
              <label className="block text-lg font-medium text-gray-50">
                내용 <span className="text-red-500">*</span>
              </label>
              <div className="min-h-[400px] rounded-md border border-gray-300 bg-white">
                <RichTextEditor
                  onChange={handleEditorChange}
                  initialContent=""
                />
              </div>
              {editorContent === '' && (
                <p className="text-sm text-red-500">내용을 입력해주세요.</p>
              )}
            </div>

            {/* 제출 버튼 */}
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={isLoading}
                className="mr-2 rounded-md bg-gray-500 px-8 py-3 text-white transition-colors hover:bg-gray-600 disabled:bg-gray-400">
                취소
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-md bg-green-600 px-8 py-3 text-white transition-colors hover:bg-green-700 disabled:bg-gray-400">
                {isLoading ? '등록 중...' : '등록하기'}
              </button>
            </div>
          </form>
        </div>
      </ContentsLayout>
    </>
  );
}
