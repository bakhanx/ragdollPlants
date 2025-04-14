import React from 'react';
import { PinIcon } from '@/app/_components/icons/Icons';

type PinProps = {
  className?: string;
  index?: number;
  rotation?: number;
};

export default function Pin({
  rotation = 0,
  index = 0,
  className = ''
}: PinProps) {
  // 더 밝고 선명한 색상의 필터 추가
  const filters = [
    'hue-rotate(0deg) saturate(1.2) brightness(1.0)', // 밝은 주황색
    'hue-rotate(120deg) saturate(1.5) brightness(1.2)', // 밝은 녹색 계열
    'hue-rotate(200deg) saturate(1.4) brightness(1.2)', // 밝은 청록색 계열
    'hue-rotate(40deg) saturate(1.2) brightness(2.0)', // 밝은 노란색 계열
    'hue-rotate(280deg) saturate(1.5) brightness(1.3)', // 밝은 보라색 계열
    'hue-rotate(320deg) saturate(1.6) brightness(1.25)' // 밝은 분홍색 계열
  ];

  // index를 filters 배열 길이로 나눈 나머지를 사용하여 색상 결정
  const colorFilter = filters[index % filters.length];

  return (
    <div
      className={`absolute -top-5 -left-5 z-10 ${className}`}
      style={{
        transform: `rotate(${rotation}deg)`
      }}>
      <PinIcon
        size={40}
        className="drop-shadow-md"
        style={{ filter: colorFilter }}
      />

      {/* 핀이 박힌 효과를 주기 위한 구멍 */}
      <div className="absolute top-6.5 left-6.5 size-2 rounded-full bg-black/20" />
      <div className="absolute top-7 left-7 size-1 rounded-full bg-black/15" />
    </div>
  );
}
