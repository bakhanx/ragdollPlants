'use client';

import React from 'react';

// 상태 옵션 데이터
export const moodOptions = [
  { value: 'good', label: '아주 좋아요', icon: '😊' },
  { value: 'normal', label: '보통이에요', icon: '😐' },
  { value: 'bad', label: '상태가 안좋아요', icon: '😢' }
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
            className={`flex items-center rounded-md border px-3 py-2 text-sm transition-colors ${
              mood === option.value
                ? 'border-green-600 bg-green-600 text-white'
                : 'border-gray-300 text-gray-50 hover:text-green-600'
            }`}>
            <span className="mr-2 text-lg">{option.icon}</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
