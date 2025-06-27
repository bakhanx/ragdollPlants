import React from 'react';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import { PlantForm } from '@/app/myplants/_components';
import { getPlantById } from '@/app/actions/plants';
import { notFound } from 'next/navigation';

interface EditPlantPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPlantPage({ params }: EditPlantPageProps) {
  try {
    const { id } = await params;
    const plant = await getPlantById(id);

    return (
      <>
        <BackgroundImage src="/images/welcome-bg-05.webp" />
        <ContentsLayout>
          <Header
            title="식물 정보 수정"
            showBack
          />

          <PlantForm
            mode="edit"
            initialData={plant}
          />
        </ContentsLayout>
      </>
    );
  } catch (error) {
    console.error('식물 정보 로딩 오류:', error);
    notFound();
  }
}
