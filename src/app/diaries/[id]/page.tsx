import { notFound } from 'next/navigation';
import Image from 'next/image';
import React from 'react';
import { diaryPosts } from '@/app/_temp';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import ContentLayout from '@/app/_components/layout/ContentsLayout';
import Header from '@/app/_components/layout/Header';
import ShareButton from '@/app/_components/common/ShareButton';

export default async function DiaryDetail(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;

  // 해당 id의 다이어리 포스트 찾기
  const post = diaryPosts.find(post => post.id === id);

  if (!post) {
    notFound();
  }

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-06.webp" />
      <ContentLayout noPadding>
        {/* 클라이언트 컴포넌트로 헤더 분리 */}
        <Header
          title={post.title}
          showBackButton
          showMenuButton
          showNotification
          variant="glass"
          contentType="diary"
          id={id}
        />

        <div className="w-full overflow-hidden rounded-2xl">
          {/* 이미지 */}
          <div className="relative h-[calc(50vh-16px)] w-full">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
            {/* 공유 버튼 */}
            <div className="absolute z-20 bottom-12 right-4">
              <ShareButton
                url={`${process.env.NEXT_PUBLIC_APP_URL}/diaries/${id}`}
                title={post.title}
              />
            </div>

            {/* 그라데이션 오버레이 추가 */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
          </div>

          {/* 콘텐츠 */}
          <div className="relative z-10 -mt-10 min-h-[calc(40vh+40px)] rounded-t-3xl bg-white/90 p-8 shadow-lg backdrop-blur-sm">
            <div className="mb-5 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800">{post.title}</h1>
              <time className="text-sm text-gray-500">{post.date}</time>
            </div>

            <div className="mb-6 flex items-center">
              <span className="text-sm font-medium text-gray-500">
                작성자: 초롱이
              </span>
            </div>

            <div className="mb-6 rounded-xl">
              <h2 className="mb-1 text-lg font-semibold text-gray-700">
                상태 : 좋음😀
              </h2>
            </div>

            <p className="text-base leading-relaxed whitespace-pre-line text-gray-600">
              {post.content}
            </p>
          </div>
        </div>
      </ContentLayout>
    </>
  );
}
