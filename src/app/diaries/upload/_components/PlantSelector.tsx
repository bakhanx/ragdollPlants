'use client';

import React from 'react';

interface Plant {
  id: string;
  name: string;
}

interface PlantSelectorProps {
  plants: Plant[];
  selectedPlantId: string | null;
  onPlantSelect: (plantId: string | null) => void;
  isLoading?: boolean;
}

export const PlantSelector = ({
  plants,
  selectedPlantId,
  onPlantSelect,
  isLoading = false
}: PlantSelectorProps) => {
  const selectedPlant = plants.find(plant => plant.id === selectedPlantId);

  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm font-medium text-gray-50">
        식물 선택
      </label>

      {/* 현재 선택된 식물 표시 */}
      {selectedPlant ? (
        <div className="mb-2 rounded-lg bg-green-50 p-3">
          <span className="text-sm font-medium text-gray-800">
            선택된 식물:{' '}
            <span className="text-green-600">{selectedPlant.name}</span>
          </span>
        </div>
      ) : (
        <div className="mb-2 rounded-lg bg-black/50 p-3">
          <span className="text-sm text-gray-50">
            일기와 연결할 식물을 선택해주세요.
          </span>
        </div>
      )}

      {/* 식물 선택 드롭다운 */}
      <select
        value={selectedPlantId || ''}
        onChange={e => onPlantSelect(e.target.value || null)}
        disabled={isLoading}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-50 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100">
        <option
          className="text-black"
          value="">
          선택 안함 (일반 일기)
        </option>
        {plants.map(plant => (
          <option
            className="text-black"
            key={plant.id}
            value={plant.id}>
            {plant.name}
          </option>
        ))}
      </select>

      {isLoading && (
        <p className="mt-1 text-xs text-gray-500">식물 목록을 불러오는 중...</p>
      )}

      {!isLoading && plants.length === 0 && (
        <p className="mt-1 text-xs text-gray-300">
          등록된 식물이 없습니다. 먼저 식물을 등록해보세요.
        </p>
      )}
    </div>
  );
};
