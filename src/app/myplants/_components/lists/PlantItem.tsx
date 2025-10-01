import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { WaterIcon, NutrientIcon } from '@/app/_components/icons/Icons';
import { GRAY_PLACEHOLDER } from '@/app/_constants/imagePlaceholders';
import { getImageSrc } from '@/app/_utils/imageUtils';
import { PlantItemProps } from '@/types/components/plants';

export default function PlantItem({ plant }: PlantItemProps) {
  return (
    <Link
      href={`/myplants/${plant.id}`}
      className="relative flex flex-col overflow-hidden rounded-lg shadow-md transition-all hover:shadow-lg border-0">
      <div className="relative aspect-square w-full overflow-hidden ">
        <Image
          src={getImageSrc(plant.image, 'small') || '/images/default-img.webp'}
          alt={plant.name}
          fill
          placeholder="blur"
          blurDataURL={GRAY_PLACEHOLDER}
          className="object-cover brightness-80 filter transition-all duration-300 hover:brightness-100 "
          priority={false}
          unoptimized
        />
        {/* 물/영양 아이콘 */}
        <div className="absolute top-2 right-2 flex space-y-1 gap-x-2">
          {plant.needsWater && (
            <div className="rounded-full bg-blue-100 p-1.5">
              <WaterIcon
                size={16}
                className="[&_path]:fill-blue-600"
              />
            </div>
          )}
          {plant.needsNutrient && (
            <div className="rounded-full bg-amber-100 p-1.5">
              <NutrientIcon
                size={16}
                className="[&_path]:fill-amber-600"
              />
            </div>
          )}
        </div>
      </div>

      <div className="p-2 bg-white flex flex-col justify-between h-20">
        <h3 className="sm:text-base text-sm text-gray-900 line-clamp-2">{plant.name}</h3>
        <p className="text-xs text-gray-500">{plant.category}</p>
      </div>
    </Link>
  );
}
