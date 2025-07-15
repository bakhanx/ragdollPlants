import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export const Skeleton = ({ 
  className = '', 
  width = 'w-full', 
  height = 'h-4',
  rounded = 'md'
}: SkeletonProps) => {
  const roundedClass = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md', 
    lg: 'rounded-lg',
    full: 'rounded-full'
  }[rounded];

  return (
    <div 
      className={`animate-pulse bg-gray-300 ${width} ${height} ${roundedClass} ${className}`}
    />
  );
};

// 텍스트 라인 스켈레톤
export const SkeletonText = ({ 
  lines = 1, 
  className = '',
  lastLineWidth = 'w-3/4'
}: { 
  lines?: number; 
  className?: string;
  lastLineWidth?: string;
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={index === lines - 1 ? lastLineWidth : 'w-full'}
          height="h-4"
        />
      ))}
    </div>
  );
};

// 이미지 스켈레톤
export const SkeletonImage = ({ 
  className = '',
  aspectRatio = 'aspect-video'
}: {
  className?: string;
  aspectRatio?: string;
}) => {
  return (
    <div className={`${aspectRatio} ${className}`}>
      <Skeleton className="w-full h-full" rounded="lg" />
    </div>
  );
};