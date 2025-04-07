import Image from 'next/image';
import React from 'react';

type PlantListProps = {
  items: {
    name: string;
    image: string;
    isNew: boolean;
  }[];
};

export const PlantList = ({ items }: PlantListProps) => {
  return (
    <div className="w-full py-6">
      <div className="text-lg font-bold">My Plants Best 3</div>

      <div className="grid w-full max-w-md grid-cols-2 gap-4">
        {items.map((plant, index) => (
          <div
            key={index}
            className="relative">
            <div className="relative aspect-square w-full rounded-lg object-cover">
              <Image
                fill
                src={plant.image}
                alt={plant.name || 'New Plant'}
                style={{ objectFit: 'cover', borderRadius: '5%' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
