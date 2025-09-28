import { Suspense } from 'react';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import ArticleListWrapper from './_components/ArticleListWrapper';
import ArticleCardsSkeleton from './_components/ArticleCardsSkeleton';

export default async function ArticlesPage() {
  return (
    <>
      <BackgroundImage src="/images/welcome-bg-07.webp" />
      <ContentsLayout>
        <Header title="아티클" />

        <div className="w-full py-4">
          {/* 아티클 목록  */}
          <Suspense fallback={<ArticleCardsSkeleton />}>
            <ArticleListWrapper />
          </Suspense>
        </div>
      </ContentsLayout>
    </>
  );
}
