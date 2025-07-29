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

interface MyPlantDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MyPlantDetailPage({
  params
}: MyPlantDetailPageProps) {
  const { id } = await params;

  try {
    // 식물 상세 정보, 관련 일기 병렬 조회
    const [plant, diaries] = await Promise.all([
      getPlantById(id),
      getDiariesByMyPlantDetail(id)
    ]);

    if (!plant) {
      notFound();
    }

    return (
      <>
        <BackgroundImage src="/images/welcome-bg-05.webp" />
        <ContentsLayout>
          <Header
            id={id}
            title={plant.name}
            showBack
            contentType="plant"
            showContentMenu={true}
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
              plantId={id}
              diaries={diaries || []}
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
