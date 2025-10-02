'use client';

import React from 'react';

// 상태 옵션 데이터
export const moodOptions = [
  { value: 'good', label: '좋음', icon: '😊' },
  { value: 'normal', label: '보통', icon: '😐' },
  { value: 'bad', label: '나쁨', icon: '😢' }
];

interface DiaryMoodSelectorProps {
  mood: string;
  setMood: (mood: string) => void;
}

export const DiaryMoodSelector = ({
  mood,
  setMood
}: DiaryMoodSelectorProps) => {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-50">
        오늘의 상태
      </label>
      <div className="grid grid-cols-3 gap-2">
        {moodOptions.map(option => (
          <button
            key={option.value}
            type="button"
            onClick={() => setMood(option.value)}
            className={`flex items-center justify-center rounded-md border px-3 py-2 text-sm transition-colors ${
              mood === option.value
                ? 'border-green-600 bg-green-600 text-white'
                : 'border-gray-300 text-gray-50 hover:text-green-600'
            }`}>
            <span className="mr-1 text-base sm:mr-2 sm:text-lg">
              {option.icon}
            </span>
            <span className="text-xs sm:text-sm">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
