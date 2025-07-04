'use client';

import React from 'react';

interface SubmitButtonProps {
  disabled: boolean;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

export default function SubmitButton({ 
  disabled, 
  isLoading = false, 
  mode = 'create' 
}: SubmitButtonProps) {
  const buttonText = {
    create: { idle: '저장하기', loading: '업로드 중...' },
    edit: { idle: '수정 완료', loading: '수정 중...' }
  };

  return (
    <div className="mt-8 flex justify-center">
      <button
        type="submit"
        disabled={disabled}
        className="w-full rounded-md bg-green-600 py-2 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:text-gray-600">
        {isLoading ? buttonText[mode].loading : buttonText[mode].idle}
      </button>
    </div>
  );
} 