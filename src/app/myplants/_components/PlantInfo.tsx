import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { EditIcon } from '@/app/_components/icons/Icons';
import { formatDateKorean } from '@/app/_utils/dateUtils';

interface PlantInfoProps {
  id: string;
  name: string;
  imageUrl: string;
  plantType: string;
  location: string;
  acquiredDate: string;
}

export const PlantInfo = ({
  id,
  name,
  imageUrl,
  plantType,
  location,
  acquiredDate
}: PlantInfoProps) => {
  return (
    <div className="flex flex-col py-4">
      <div className="relative mx-auto mb-4 aspect-square w-full overflow-hidden rounded-md">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      <div className="relative mx-auto my-2 flex items-center justify-center">
        <h1 className="text-center text-2xl font-bold text-gray-50">{name}</h1>
        <Link
          href={`/myplants/${id}/edit`}
          className="absolute right-0 translate-x-6 text-gray-500">
          <EditIcon
            size={18}
            className="[&_path]:stroke-gray-50"
          />
        </Link>
      </div>

      <div className="text-center text-sm text-gray-50">
        <p>
          {plantType} • {location}
        </p>
        <p>입양일: {formatDateKorean(acquiredDate)}</p>
      </div>
    </div>
  );
};
