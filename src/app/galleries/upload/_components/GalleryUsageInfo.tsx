'use client';

import React from 'react';

interface GalleryUsageInfoProps {
  used: number;
  max: number;
}

export default function GalleryUsageInfo({ used, max }: GalleryUsageInfoProps) {
  const remaining = max - used;
  
  return (
    <div className="mb-6 mt-4">
      <div className="flex justify-between items-center mb-2">
        <p className="text-white text-sm">
          업로드된 갤러리 ({used}/{max})
        </p>
        <span className="text-white text-sm">
          남은 공간: {remaining}장
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-green-600 h-2.5 rounded-full" 
          style={{ width: `${(used / max) * 100}%` }}
        ></div>
      </div>
    </div>
  );
} 