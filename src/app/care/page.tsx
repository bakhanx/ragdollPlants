import React, { Suspense } from 'react';
import { Header } from '../_components/header/Header';
import { ContentsLayout } from '../_components/layout/ContentsLayout';
import BackgroundImage from '../_components/layout/BackgroundImage';
import { CareCardListWrapper } from './_components/CareCardListWrapper';
import { CareCardListSkeleton } from './_components/CareCardListSkeleton';

export default async function Page() {
  return (
    <>
      <BackgroundImage src="/images/welcome-bg-03.webp" />
      <ContentsLayout>
        <Header
          title="식물 케어"
          showNotification
        />

        <Suspense fallback={<CareCardListSkeleton />}>
          <CareCardListWrapper />
        </Suspense>
      </ContentsLayout>
    </>
  );
}
