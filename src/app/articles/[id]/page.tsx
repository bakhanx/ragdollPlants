import { notFound } from 'next/navigation';
import Image from 'next/image';
import React from 'react';
import { articleItems } from '@/app/_temp';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import { ShareButton } from '@/app/_components/common/ShareButton';
import CategoryBadge from '../_components/CategoryBadge';

export default async function ArticleDetail(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const { id } = params;
  // 문자열 ID를 숫자로 변환
  const numericId = parseInt(id, 10);

  // 해당 id의 아티클 찾기
  const article = articleItems.find(item => item.id === numericId);

  if (!article) {
    notFound();
  }

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-06.webp" />
      <ContentsLayout noPadding>
        {/* 클라이언트 컴포넌트로 헤더 분리 */}
        <Header
          title={article.title}
          id={id}
          showBack
          showMenuButton
          showNotification
          variant="glass"
          contentType="article"
        />

        <div className="w-full overflow-hidden rounded-2xl">
          {/* 이미지 */}
          <div className="relative h-[calc(50vh-16px)] w-full">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />

            <div className="absolute right-4 bottom-12 z-20">
              <ShareButton
                url={`${process.env.NEXT_PUBLIC_APP_URL}/articles/${id}`}
                title={article.title}
              />
            </div>
            {/* 그라데이션 오버레이 추가 */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
          </div>

          {/* 콘텐츠 */}
          <div className="relative z-10 -mt-10 min-h-[calc(40vh+40px)] rounded-t-3xl bg-white/90 p-8 shadow-lg backdrop-blur-sm">
            <div className="absolute top-2 right-4 z-20">
              <CategoryBadge category={article.category} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              {article.title}
            </h1>

            <div className="mb-6 flex items-center justify-between pt-12">
              <span className="text-sm font-medium text-gray-500">
                작성자: {article.author || '익명'}
              </span>
              <time className="text-end text-sm text-gray-500">
                {article.date}
              </time>
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <span
                    key={tag}
                    className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <p className="text-base leading-relaxed whitespace-pre-line text-gray-600">
              {article.content}
            </p>
          </div>
        </div>
      </ContentsLayout>
    </>
  );
}
