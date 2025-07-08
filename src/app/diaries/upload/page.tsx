import React from 'react';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import { DiaryForm } from './_components';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function CreateDiaryPage() {
  // 서버에서 세션 확인
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }

  // 임시 구독 상태 확인
  const isPaidUser = false; // 임시값

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-05.webp" />
      <ContentsLayout showFooter={false}>
        <Header
          title="일기 작성"
          showBack
        />
        
        <DiaryForm 
          isPaidUser={isPaidUser}
          toggleSubscription={() => {}}
        />
      </ContentsLayout>
    </>
  );
}
