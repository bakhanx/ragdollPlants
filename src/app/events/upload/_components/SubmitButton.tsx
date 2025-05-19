import React from 'react';

export interface SubmitButtonProps {
  isLoading: boolean;
  isSubmitting: boolean;
}

export const SubmitButton = ({ isLoading, isSubmitting }: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      disabled={isLoading || isSubmitting}
      className="w-full rounded-md bg-green-600 py-2 text-white transition-colors hover:bg-green-700 disabled:bg-gray-400">
      {isLoading || isSubmitting ? '등록 중...' : '이벤트 등록하기'}
    </button>
  );
}; 