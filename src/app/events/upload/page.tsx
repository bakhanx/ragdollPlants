import React from 'react';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import { EventUploadForm } from './_components';

export default function UploadEventPage() {
  return (
    <>
      <BackgroundImage src="/images/welcome-bg-05.webp" />
      <ContentsLayout>
        <Header
          title="이벤트 등록"
          showBack={true}
        />

        <EventUploadForm mode="create" />
      </ContentsLayout>
    </>
  );
}
