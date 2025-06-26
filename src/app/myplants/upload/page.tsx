import React from 'react';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import { PlantUploadForm } from './_components/PlantUploadForm';

export default function RegisterPlantPage() {
  return (
    <>
      <BackgroundImage src="/images/welcome-bg-05.webp" />
      <ContentsLayout>
        <Header
          title="새 식물 등록"
          showBack
        />

        <PlantUploadForm />
      </ContentsLayout>
    </>
  );
}
