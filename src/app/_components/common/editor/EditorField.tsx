'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="h-96 w-full animate-pulse rounded-md bg-gray-200"></div>
  )
});

interface EditorFieldProps {
  label: string;
  onChange: (content: string) => void;
  initialContent: string;
  placeholder?: string;
  required?: boolean;
  showError?: boolean;
  errorMessage?: string;
  labelSize?: 'sm' | 'lg';
}

export default function EditorField({
  label,
  onChange,
  initialContent,
  placeholder = '내용을 입력하세요...',
  required = false,
  showError = false,
  errorMessage = '내용을 입력해주세요.',
  labelSize = 'sm'
}: EditorFieldProps) {
  const labelClassName =
    labelSize === 'lg'
      ? 'block text-lg font-medium text-gray-50'
      : 'block text-sm font-medium text-gray-50';

  return (
    <div className="space-y-2 text-black">
      <label className={labelClassName}>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <div className="min-h-[400px] rounded-md border border-gray-300 bg-white">
        <RichTextEditor
          onChange={onChange}
          initialContent={initialContent}
          placeholder={placeholder}
        />
      </div>
      {showError && <p className="text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
}
