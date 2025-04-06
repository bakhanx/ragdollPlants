'use client';

import Image from 'next/image';
import Water from '@/../public/svg/water.svg';
import Water2 from '@/../public/svg/water2.svg';
import { useState } from 'react';

type WaterCardProps = {
  backgroundColor: string;
  imageSrc: string;
  title: string;
  amount: number;
  statusIcon?: string;
  initialWaterStatus: boolean;
  isUpdating?: boolean;
  onWaterStatusChange?: (isWatered: boolean) => void;
  isDisabled?: boolean;
};

export const WaterCard = ({
  backgroundColor,
  imageSrc,
  title,
  amount,
  statusIcon,
  initialWaterStatus,
  isUpdating = false,
  onWaterStatusChange,
  isDisabled = false
}: WaterCardProps) => {
  const [waterStatus, setWaterStatus] = useState(initialWaterStatus);

  const handleWaterClick = () => {
    if (isDisabled || isUpdating) return;

    const newStatus = !waterStatus;
    setWaterStatus(newStatus);
    onWaterStatusChange?.(newStatus);
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

      {/* 물주기 정보 */}
      <div className="flex w-full flex-col text-blue-500">
        <p className="font-medium text-white">{title}</p>
        <div className="mt-2 flex items-center gap-2">
          <Water className="size-3" />
          <p className="text-sm text-white">{amount}ml</p>
        </div>
      </div>

      {/* 물주기 아이콘 */}
      <button
        onClick={handleWaterClick}
        disabled={isDisabled || isUpdating}
        className={`flex size-12 items-center justify-center rounded-full transition-all duration-300 ${
          isDisabled
            ? 'cursor-not-allowed bg-gray-300/30'
            : isUpdating
              ? 'cursor-wait bg-white/40'
              : 'bg-white/30 hover:bg-white/40 active:scale-95'
        } shrink-0 backdrop-blur-sm`}
        aria-label="물주기 상태 변경">
        <Water2
          className={`size-5 transition-all duration-300 ${
            waterStatus ? 
            '[&_path]:fill-blue-500' : '[&_path]:fill-transparent'
          } ${isUpdating ? 'animate-pulse' : ''} `}
        />
      </button>
    </div>
  );
};
