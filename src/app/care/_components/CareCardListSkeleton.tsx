import React from 'react';
import { CareCardSkeleton } from './CareCardSkeleton';

export const CareCardListSkeleton = () => {
  return (
    <div className="space-y-4 py-10">
      {Array.from({ length: 1 }).map((_, index) => (
        <CareCardSkeleton key={index} />
      ))}
    </div>
  );
};