import React from 'react';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import { AdminCheck, EventUploadForm } from './_components';

export default function UploadEventPage() {
  return (
    <>
      <BackgroundImage src="/images/welcome-bg-02.webp" />
      <ContentsLayout>
        <Header
          title="이벤트 등록"
          showBack={true}
        />
        
        <AdminCheck
          loadingComponent={
            <div className="flex h-[80vh] items-center justify-center">
              <p className="text-center text-lg">로딩 중...</p>
            </div>
          }
          unauthorizedComponent={
            <div className="flex h-[80vh] items-center justify-center">
              <p className="text-center text-lg">
                관리자만 접근할 수 있는 페이지입니다.
              </p>
            </div>
          }
        >
          <EventUploadForm />
        </AdminCheck>
      </ContentsLayout>
    </>
  );
}
