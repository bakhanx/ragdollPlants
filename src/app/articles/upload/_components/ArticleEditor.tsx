'use client';

import React from 'react';
import EditorField from '@/app/_components/common/editor/EditorField';

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
    <EditorField
      label="내용"
      onChange={onChange}
      initialContent={initialContent}
      placeholder="글 내용을 입력하세요..."
      required
      showError={showError}
      errorMessage="내용을 입력해주세요."
      labelSize="lg"
    />
  );
}
