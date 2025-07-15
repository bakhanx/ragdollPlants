import React, { Suspense } from 'react';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import { EditProfileWrapper } from '@/app/mygarden/_components/EditProfileWrapper';
import { EditProfileSkeleton } from '@/app/mygarden/_components/EditProfileSkeleton';

export default async function ProfileEditPage() {
  return (
    <>
      <BackgroundImage src="/images/welcome-bg-03.webp" />
      <ContentsLayout>
        <Header
          title="프로필 수정"
          showBack
        />

        <div className="py-4">
          <Suspense fallback={<EditProfileSkeleton />}>
            <EditProfileWrapper />
          </Suspense>
        </div>
      </ContentsLayout>
    </>
  );
}
