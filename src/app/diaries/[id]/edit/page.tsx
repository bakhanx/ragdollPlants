import React from 'react';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import { DiaryForm } from '@/app/diaries/upload/_components/DiaryForm';
import { getDiaryById } from '@/app/actions/diaries';
import { notFound } from 'next/navigation';

interface EditDiaryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditDiaryPage({ params }: EditDiaryPageProps) {
  try {
    const { id } = await params;
    const diary = await getDiaryById(id);

    return (
      <>
        <BackgroundImage src="/images/welcome-bg-06.webp" />
        <ContentsLayout>
          <Header
            title="다이어리 수정"
            showBack
          />

          <DiaryForm
            mode="edit"
            initialData={diary || undefined}
          />
        </ContentsLayout>
      </>
    );
  } catch (error) {
    console.error('다이어리 정보 로딩 오류:', error);
    notFound();
  }
} 