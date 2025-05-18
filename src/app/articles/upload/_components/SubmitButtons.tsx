import React from 'react';

interface SubmitButtonsProps {
  onCancel: () => void;
  isLoading: boolean;
}

export default function SubmitButtons({ onCancel, isLoading }: SubmitButtonsProps) {
  return (
    <div className="flex justify-end pt-4">
      <button
        type="button"
        onClick={onCancel}
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
  );
} 