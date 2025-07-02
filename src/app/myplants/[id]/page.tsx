import React from 'react';
import { notFound } from 'next/navigation';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';

import { getPlantById } from '@/app/actions/plants';
import { getDiariesByMyPlantDetail } from '@/app/actions/diaries';
import {
  PlantInfo,
  DiaryList,
  PlantDescription,
  PlantCareSection
} from '../_components';

interface PlantDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PlantDetailPage({
  params
}: PlantDetailPageProps) {
  const { id: plantId } = await params;

  try {
    // 식물 상세 정보와 관련 일기를 병렬로 가져오기
    const [plant, diaries] = await Promise.all([
      getPlantById(plantId),
      getDiariesByMyPlantDetail(plantId)
    ]);

    if (!plant) {
      notFound();
    }

    return (
      <>
        <BackgroundImage src="/images/welcome-bg-05.webp" />
        <ContentsLayout>
          <Header
            title={plant.name}
            showBack
            contentType="plant"
            id={plantId}
            showContentMenu={true}
            isOwner={true}
          />

          <div className="w-full divide-y divide-gray-100">
            <PlantInfo
              id={plant.id}
              name={plant.name}
              imageUrl={plant.image || '/images/plant-default.png'}
              plantType={plant.category}
              location={plant.location || ''}
              acquiredDate={
                plant.purchaseDate?.toISOString().split('T')[0] || ''
              }
            />

            <PlantCareSection plant={plant} />

            <PlantDescription description={plant.description || undefined} />

            <DiaryList
              plantId={plantId}
              diaries={diaries}
            />
          </div>
        </ContentsLayout>
      </>
    );
  } catch (error) {
    console.error('식물 정보 로딩 오류:', error);
    notFound();
  }
}
