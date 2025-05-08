'use client';

import React from 'react';

interface PlantTypeOption {
  value: string;
  label: string;
}

interface PlantTypeSelectorProps {
  options: PlantTypeOption[];
  value: string;
  onChange: (value: string) => void;
}

/**
 * 식물 유형 선택 버튼 컴포넌트
 * 
 * 선택된 식물 유형에 따라 시각적으로 표시하고, 선택 시 상위 컴포넌트에 이벤트를 전달합니다.
 */
const PlantTypeSelector = ({ options, value, onChange }: PlantTypeSelectorProps) => {
  return (
    <div className="grid grid-cols-4 gap-2">
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-md border px-3 py-2 text-sm transition-colors ${
            value === option.value
              ? 'border-green-600 bg-green-600 text-white'
              : 'border-gray-300 text-gray-50 hover:text-green-600'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default React.memo(PlantTypeSelector); 