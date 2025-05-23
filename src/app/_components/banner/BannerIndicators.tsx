'use client';

import React from 'react';

type BannerIndicatorsProps = {
  totalSlides: number;
  currentSlide: number;
  goToSlide: (index: number) => void;
};

export const BannerIndicators: React.FC<BannerIndicatorsProps> = ({
  totalSlides,
  currentSlide,
  goToSlide
}) => {
  return (
    <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 space-x-2">
      {Array.from({ length: totalSlides }).map((_, index) => (
        <button
          key={index}
          onClick={() => goToSlide(index)}
          className={`h-2 w-2 rounded-full transition-colors ${
            currentSlide === index ? 'bg-white' : 'bg-white/50'
          }`}
          aria-label={`배너 ${index + 1}번으로 이동`}
        />
      ))}
    </div>
  );
};

export default BannerIndicators; 