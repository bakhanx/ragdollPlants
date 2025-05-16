'use client';

import React from 'react';

interface SubmitButtonProps {
  disabled: boolean;
}

export default function SubmitButton({ disabled }: SubmitButtonProps) {
  return (
    <div className="mt-8 flex justify-center">
      <button
        type="submit"
        disabled={disabled}
        className="w-full rounded-md bg-green-600 py-2 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:text-gray-600">
        저장하기
      </button>
    </div>
  );
} 