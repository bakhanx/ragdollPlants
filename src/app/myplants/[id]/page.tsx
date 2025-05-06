import React from 'react';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import { PlantInfo } from '@/app/myplants/_components/PlantInfo';
import { CareSummary } from '@/app/myplants/_components/CareSummary';
import { DiaryList } from '@/app/myplants/_components/DiaryList';
import { plantDetails, recentDiaries } from '@/app/_temp/plantDetailData';

interface PlantDetailPageProps {
  params: {
    id: string;
  };
}

export default function PlantDetailPage({ params }: PlantDetailPageProps) {
  const plantId = params.id;

  // 실제 구현에서는 여기서 plantId를 사용하여 데이터를 가져옴
  // 현재는 임시 데이터 사용

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-05.webp" />
      <ContentsLayout>
        <Header
          title={plantDetails.name}
          showBack
        />

        <div className="w-full divide-y divide-gray-100">
          <PlantInfo
            id={plantDetails.id}
            name={plantDetails.name}
            imageUrl={plantDetails.imageUrl}
            plantType={plantDetails.plantType}
            location={plantDetails.location}
            acquiredDate={plantDetails.acquiredDate}
          />

          <CareSummary
            id={plantDetails.id}
            lastWatered={plantDetails.lastWatered}
            wateringCycle={plantDetails.wateringCycle}
            lastFertilized={plantDetails.lastFertilized}
            fertilizerCycle={plantDetails.fertilizerCycle}
            notes={plantDetails.notes}
          />

          <DiaryList
            plantId={plantId}
            diaries={recentDiaries}
          />
        </div>
      </ContentsLayout>
    </>
  );
}
