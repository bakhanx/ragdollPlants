'use client';

import React from 'react';

interface GalleryTitleFieldProps {
  title: string;
  setTitle: (title: string) => void;
}

export default function GalleryTitleField({ title, setTitle }: GalleryTitleFieldProps) {
  return (
    <div>
      <label
        htmlFor="title"
        className="mb-1 block text-sm font-medium text-gray-50">
        작품명 <span className="text-red-500">*</span>
      </label>
      <input
        id="title"
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
        placeholder="작품명을 입력해주세요 (최대 30자)"
        maxLength={30}
        className="bg-opacity-20 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-white focus:ring-1 focus:ring-white focus:outline-none"
      />
    </div>
  );
} 