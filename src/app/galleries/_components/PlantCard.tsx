import { myPlants } from '@/app/_temp';
import Image from 'next/image';
import React from 'react';
import Water from '@/../public/svg/water2.svg';

const PlantCard = () => {
  return (
    <div className="grid h-full w-full grid-cols-3 justify-center gap-5 py-4">
      {/* inext 고칠것 */}
      {myPlants.map((plant, index) => (
        <div
          key={index}
          className="relative aspect-square w-full rounded-md transition-all duration-300 hover:scale-105">
          <Image
            className="rounded-md"
            fill
            alt={plant.name}
            src={plant.image}
            style={{ objectFit: 'cover' }}
          />

          {/* 상태 아이콘 */}
          {plant.status && (
            <div className="absolute -top-2 -right-2 flex size-8 items-center justify-center rounded-full bg-[#ff735d] shadow-lg">
              <Water className="h-full w-full p-2 [&_path]:fill-blue-500" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PlantCard;
