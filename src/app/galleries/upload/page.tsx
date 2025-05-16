import React from 'react';
import { Metadata } from 'next';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import GalleryUploadForm from './_components/GalleryUploadForm';

export const metadata: Metadata = {
  title: '갤러리 업로드 - 라그돌플랜츠',
  description: '소중한 식물의 아름다운 순간을 공유하세요',
};

export default function UploadGalleryPage() {
  return (
    <>
      <BackgroundImage src="/images/welcome-bg-02.webp" />
      <ContentsLayout>
        <Header
          title="갤러리 업로드"
          showBack={true}
        />
        <GalleryUploadForm />
      </ContentsLayout>
    </>
  );
}
