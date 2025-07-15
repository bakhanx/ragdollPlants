'use client';

import React from 'react';
import { CareCard } from './CareCard';
import { CareCardListProps } from '@/types/components/care';

export const CareCardList = ({ plants: initialPlants }: CareCardListProps) => {
  return (
    <div className="space-y-4 py-10">
      {initialPlants.map(plant => (
        <CareCard
          key={plant.id}
          plant={{
            id: plant.id,
            name: plant.name,
            image: plant.image,
            lastWateredDate: plant.lastWateredDate ? new Date(plant.lastWateredDate) : null,
            wateringInterval: plant.waterInterval,
            lastNutrientDate: plant.lastNutrientDate ? new Date(plant.lastNutrientDate) : null,
            nutrientInterval: plant.nutrientInterval
          }}
        />
      ))}
    </div>
  );
};
