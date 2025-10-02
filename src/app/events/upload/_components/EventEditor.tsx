'use client';

import React from 'react';
import EditorField from '@/app/_components/common/editor/EditorField';

interface EventEditorProps {
  onChange: (content: string) => void;
  initialContent: string;
  showError?: boolean;
}

export default function EventEditor({ 
  onChange, 
  initialContent, 
  showError = false 
}: EventEditorProps) {
  return (
    <EditorField
      label="상세 내용"
      onChange={onChange}
      initialContent={initialContent}
      placeholder="이벤트 상세 내용을 입력해주세요..."
      required
      showError={showError}
      errorMessage="상세 내용을 입력해주세요."
      labelSize="sm"
    />
  );
}
