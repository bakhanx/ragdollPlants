import Image from 'next/image';
import React from 'react';

type PlantListProps = {
  items: {
    name: string;
    image: string;
    isNew: boolean;
  }[];
};

export const ArticleList = ({ items }: PlantListProps) => {
  return (
    <div className="w-full py-6">
      <div className="text-lg font-bold">Article</div>

      <div className="flex w-full max-w-md flex-col gap-4">
        {items.map((plant, index) => (
          <div
            key={index}
            className="relative flex gap-x-2 rounded-md bg-[#ffffffa5] shadow-xl">
            <div className="relative flex size-24 shrink-0 rounded-lg object-cover">
              <Image
                fill
                src={plant.image}
                alt={plant.name || 'New Plant'}
                style={{ objectFit: 'cover', borderRadius: '5%' }}
              />
            </div>
            <div className="flex flex-col">
              <h2 className="font-semibold">{plant.name}</h2>
              <p className="text-sm text-gray-600">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Molestias expedita et amet consectetur
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
