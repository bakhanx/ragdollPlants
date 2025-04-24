import React from 'react';

// 색상 팔레트 구성을 위한 색상 배열
export const colorPalette = [
  // 그레이스케일
  ['#000000', '#5c5c5c', '#929292', '#c5c5c5', '#e0e0e0', '#ffffff'],
  // 기본 6색
  ['#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#0000FF', '#9900FF'],
  // 파스텔
  ['#FFB6C1', '#FFD700', '#ADFF2F', '#7FFFD4', '#87CEFA', '#DDA0DD'],
  // 어두운 계열
  ['#800000', '#663300', '#556B2F', '#008080', '#000080', '#4B0082'],
  // 밝은 계열
  ['#FF69B4', '#FF7F50', '#FFFF54', '#00FF7F', '#1E90FF', '#FF00FF']
];

type ColorPaletteProps = {
  onSelectColor: (color: string) => void;
};

// 색상 팔레트 컴포넌트
const ColorPalette: React.FC<ColorPaletteProps> = ({ onSelectColor }) => {
  return (
    <div className="absolute top-full left-0 mt-1 bg-white shadow-md rounded p-1 z-10 w-[180px]">
      {colorPalette.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-1 mb-1">
          {row.map((color, colIndex) => (
            <button
              key={`color-${rowIndex}-${colIndex}`}
              type="button"
              onClick={() => onSelectColor(color)}
              className="w-6 h-6 rounded-sm hover:ring-2 ring-offset-1 ring-gray-400"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ColorPalette; 