import { notFound } from 'next/navigation';
import React from 'react';
import { diaryPosts } from '@/app/_temp/diaryData';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import DiaryImage from '@/app/diaries/_components/DiaryImage';
import DiaryContent from '@/app/diaries/_components/DiaryContent';

export default async function DiaryDetail(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;

  const post = diaryPosts.find(post => post.id === id);

  if (!post) {
    notFound();
  }

  const diaryDetail = {
    id: post.id,
    title: post.title,
    content: post.content,
    date: post.date,
    status: post.status,
    authorName: post.authorName || '초롱이'
  };

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-06.webp" />
      <ContentsLayout noPadding>
        {/* 헤더 */}
        <Header
          title={post.title}
          showMenuButton
          showNotification
          variant="glass"
          contentType="diary"
          id={id}
        />

        <div className="w-full overflow-hidden rounded-2xl">
          {/* 이미지 및 공유 버튼 */}
          <DiaryImage
            imageUrl={post.imageUrl}
            title={post.title}
            id={post.id}
          />

          {/* 일기 콘텐츠 */}
          <DiaryContent diary={diaryDetail} />
        </div>
      </ContentsLayout>
    </>
  );
}
