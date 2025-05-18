'use client';

import React from 'react';
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

interface ArticleEditorProps {
  onChange: (content: string) => void;
  initialContent: string;
  showError?: boolean;
}

export default function ArticleEditor({ 
  onChange, 
  initialContent, 
  showError = false 
}: ArticleEditorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-lg font-medium text-gray-50">
        내용 <span className="text-red-500">*</span>
      </label>
      <div className="min-h-[400px] rounded-md border border-gray-300 bg-white">
        <RichTextEditor
          onChange={onChange}
          initialContent={initialContent}
        />
      </div>
      {showError && (
        <p className="text-sm text-red-500">내용을 입력해주세요.</p>
      )}
    </div>
  );
} 