import React from 'react';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import { DiaryForm } from './_components';
import { getCurrentUser } from '@/lib/auth-utils';

export default async function CreateDiaryPage() {
  
  await getCurrentUser();

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-05.webp" />
      <ContentsLayout showFooter={false}>
        <Header
          title="일기 작성"
          showBack
        />

        <DiaryForm />
      </ContentsLayout>
    </>
  );
}
