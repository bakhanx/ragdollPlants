import React from 'react';
import { WaterIcon, NutrientIcon } from '@/app/_components/icons';
import CareStatusCard from './CareStatusCard';

interface CareStatusSectionProps {
  todayWaterCount: number;
  todayNutrientCount: number;
}

export default function CareStatusSection({ 
  todayWaterCount, 
  todayNutrientCount 
}: CareStatusSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <CareStatusCard
        icon={<WaterIcon />}
        iconColor="[&_path]:stroke-blue-600"
        title="물 주기"
        count={todayWaterCount}
        href="/care"
        textColor="text-blue-600"
      />
      <CareStatusCard
        icon={<NutrientIcon />}
        iconColor="[&_path]:stroke-yellow-600"
        title="영양 관리"
        count={todayNutrientCount}
        href="/care"
        textColor="text-yellow-600"
      />
    </div>
  );
} 