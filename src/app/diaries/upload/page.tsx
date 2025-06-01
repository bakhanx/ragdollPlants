'use client';

import React, { useState } from 'react';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import { useAuth } from '@/app/_hooks/useAuth';
import { DiaryForm } from './_components';

export default function CreateDiaryPage() {
  const { isLoggedIn } = useAuth();
  
  // 구독 상태 임시 설정 (실제로는 API 호출)
  const [isPaidUser, setIsPaidUser] = useState(false);
  
  // 테스트용 구독 상태 토글
  const toggleSubscription = () => {
    setIsPaidUser(!isPaidUser);
  };

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
          toggleSubscription={toggleSubscription}
        />
      </ContentsLayout>
    </>
  );
}
