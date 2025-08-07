import { notFound } from 'next/navigation';
import React from 'react';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import DiaryImage from '@/app/diaries/_components/DiaryImage';
import DiaryContent from '@/app/diaries/_components/DiaryContent';
import { getDiaryWithOwnership } from '@/app/actions/diaries';
import { DiaryMoodStatus } from '@/types/models/diary';
import { formatDateTime } from '@/app/_utils/dateUtils';

export default async function DiaryDetail(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;

  try {
    const { diary } = await getDiaryWithOwnership(id);

    const diaryDetail = {
      id: diary.id,
      title: diary.title,
      content: diary.content,
      date: diary.date,
      status: diary.status as DiaryMoodStatus,
      authorName: diary.author?.name || '익명'
    };

    return (
      <>
        <BackgroundImage src="/images/welcome-bg-06.webp" />
        <ContentsLayout noPadding>
          {/* 헤더 */}
          <Header
            title={diary.title}
            showBack
            variant="glass"
            contentType="diary"
            id={id}
            showContentMenu
          />

          <div className="w-full overflow-hidden rounded-2xl">
            {/* 이미지 및 공유 버튼 */}
            <DiaryImage
              imageUrl={diary.image || '/images/plant-default.png'}
              title={diary.title}
              id={diary.id}
            />

            {/* 일기 콘텐츠 */}
            <DiaryContent diary={diaryDetail} />
          </div>
        </ContentsLayout>
      </>
    );
  } catch (error) {
    console.error('다이어리 조회 오류:', error);
    notFound();
  }
}
