'use client';

import React from 'react';

interface SelectedPlantInfoProps {
  selectedPlant: {
    id: string;
    name: string;
  } | null;
}

export const SelectedPlantInfo = ({
  selectedPlant
}: SelectedPlantInfoProps) => {
  return (
    <>
      {selectedPlant ? (
        <div className="mb-4 rounded-lg bg-green-50 p-3">
          <span className="text-sm font-medium text-gray-800">
            선택된 식물:{' '}
            <span className="text-green-600">{selectedPlant.name}</span>
          </span>
        </div>
      ) : (
        <div className="mb-4 rounded-lg bg-amber-50 p-3">
          <span className="text-sm text-amber-800">식물을 선택해주세요.</span>
        </div>
      )}
    </>
  );
};
