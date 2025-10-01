import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { EditIcon } from '@/app/_components/icons/Icons';
import { formatDateKorean } from '@/app/_utils/dateUtils';
import { PLANT_PLACEHOLDER } from '@/app/_constants/imagePlaceholders';
import { getImageSrc } from '@/app/_utils/imageUtils';

interface PlantInfoProps {
  id: string;
  name: string;
  imageUrl: string;
  plantType: string;
  location: string;
  acquiredDate: string;
  isOwner?: boolean;
}

export const PlantInfo = ({
  id,
  name,
  imageUrl,
  plantType,
  location,
  acquiredDate,
  isOwner
}: PlantInfoProps) => {
  return (
    <div className="flex flex-col py-4">
      <div className="relative mx-auto mb-4 aspect-square w-full overflow-hidden rounded-md bg-black/30">
        <Image
          src={getImageSrc(imageUrl, 'medium') || 'images/default-img.webp'}
          alt={name}
          fill
          placeholder="blur"
          blurDataURL={`${imageUrl}/small` || PLANT_PLACEHOLDER}
          className="object-contain"
          priority
          unoptimized
        />
      </div>

      <div className="relative mx-auto my-2 flex items-center justify-center px-8">
        <div className="relative flex text-center text-xl font-bold text-gray-50 sm:text-2xl">
          <span>{name}</span>

          {/* 편집 버튼 */}
          {isOwner && (
            <Link
              href={`/myplants/${id}/edit`}
              className="text-gray-500">
              <EditIcon className="absolute -right-8 size-6 sm:size-8 [&_path]:stroke-green-600 hover:[&_path]:stroke-green-700" />
            </Link>
          )}
        </div>
      </div>

      <div className="text-center text-xs text-gray-50 sm:text-sm">
        <p>
          {plantType} • {location}
        </p>
        <p>{formatDateKorean(acquiredDate)}</p>
      </div>
    </div>
  );
};
