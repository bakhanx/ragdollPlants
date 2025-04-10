'use client';

import Image from 'next/image';
import Nutrient from '@/../public/svg/nutrient.svg';
import Nutrient2 from '@/../public/svg/nutrient2.svg';
import { useState } from 'react';

type NutrientCardProps = {
  backgroundColor: string;
  imageSrc: string;
  title: string;
  amount: number;
  statusIcon?: string;
  initialNutrientStatus: boolean;
  isUpdating?: boolean;
  onNutrientStatusChange?: (isNutriented: boolean) => void;
  isDisabled?: boolean;
};

export const NutrientCard = ({
  backgroundColor,
  imageSrc,
  title,
  amount,
  statusIcon,
  initialNutrientStatus,
  isUpdating = false,
  onNutrientStatusChange,
  isDisabled = false
}: NutrientCardProps) => {
  const [nutrientStatus, setNutrientStatus] = useState(initialNutrientStatus);

  const handleNutrientClick = () => {
    if (isDisabled || isUpdating) return;

    const newStatus = !nutrientStatus;
    setNutrientStatus(newStatus);
    onNutrientStatusChange?.(newStatus);
  };

  return (
    <div
      className={`flex items-center gap-4 rounded-xl p-4 ${backgroundColor}`}>
      <div className="relative size-20 shrink-0">
        <Image
          src={imageSrc}
          alt={title}
          fill
          style={{ objectFit: 'cover' }}
          className="rounded-md"
        />
      </div>

      {/* 비료주기 정보 */}
      <div className="flex w-full flex-col text-green-500">
        <p className="font-medium text-white">{title}</p>
        <div className="mt-2 flex items-center gap-2">
          <Nutrient className="size-3" />
          <p className="text-sm text-white">{amount}g</p>
        </div>
      </div>

      {/* 비료주기 아이콘 */}
      <button
        onClick={handleNutrientClick}
        disabled={isDisabled || isUpdating}
        className={`flex size-12 items-center justify-center rounded-full transition-all duration-300 ${
          isDisabled
            ? 'cursor-not-allowed bg-gray-300/30'
            : isUpdating
              ? 'cursor-wait bg-white/40'
              : 'bg-white/30 hover:bg-white/40 active:scale-95'
        } shrink-0 backdrop-blur-sm`}
        aria-label="비료주기 상태 변경">
        <Nutrient2
          className={`size-5 transition-all duration-300 ${
            nutrientStatus ? 
            '[&_path]:fill-green-500' : '[&_path]:fill-transparent'
          } ${isUpdating ? 'animate-pulse' : ''} `}
        />
      </button>
    </div>
  );
}; 