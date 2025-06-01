import React from 'react';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import { PlantUploadForm } from './_components/PlantUploadForm';

// 식물 종류 옵션 배열
const plantTypeOptions = [
  { value: '실내식물', label: '실내식물' },
  { value: '다육식물', label: '다육식물' },
  { value: '선인장', label: '선인장' },
  { value: '관엽식물', label: '관엽식물' },
  { value: '허브', label: '허브' },
  { value: '기타', label: '기타' }
];

export default function RegisterPlantPage() {
  return (
    <>
      <BackgroundImage src="/images/welcome-bg-05.webp" />
      <ContentsLayout>
        <Header
          title="새 식물 등록"
          showBack
        />

        <PlantUploadForm plantTypeOptions={plantTypeOptions} />
      </ContentsLayout>
    </>
  );
}
