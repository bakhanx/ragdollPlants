import React from 'react';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import { GalleryEditForm } from './_components/GalleryEditForm';
import { notFound } from 'next/navigation';

interface EditGalleryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditGalleryPage({
  params
}: EditGalleryPageProps) {
  try {
    const { id } = await params;

    return (
      <>
        <BackgroundImage src="/images/welcome-bg-04.webp" />
        <ContentsLayout>
          <Header
            id={id}
            contentType="gallery"
            showContentMenu
            title="갤러리 관리"
            showBack
          />

          <GalleryEditForm galleryId={id} />
        </ContentsLayout>
      </>
    );
  } catch (error) {
    console.error('갤러리 정보 로딩 오류:', error);
    notFound();
  }
}
