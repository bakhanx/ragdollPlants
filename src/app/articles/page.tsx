import { Suspense } from 'react';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import ArticleListWrapper from './_components/ArticleListWrapper';
import ArticleCardsSkeleton from './_components/ArticleCardsSkeleton';

import { checkIsAdmin } from '@/lib/auth-utils';
export default async function ArticlesPage() {
  const isAdmin = await checkIsAdmin();

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-07.webp" />
      <ContentsLayout>
        <Header title="아티클" />

        <div className="w-full py-4">
          {/* 업로드 버튼 */}
          {/* <div className="mt-4 mb-6 flex justify-end">
            <AdminUploadButton isAdmin={isAdmin} />
          </div> */}

          {/* 아티클 목록  */}
          <Suspense fallback={<ArticleCardsSkeleton />}>
            <ArticleListWrapper />
          </Suspense>
        </div>
      </ContentsLayout>
    </>
  );
}
