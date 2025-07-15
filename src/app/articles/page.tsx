import { Suspense } from 'react';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { SearchInput } from '@/app/_components/common/SearchInput';
import { UploadButton } from '@/app/_components/common/UploadButton';
import ArticleListWrapper from './_components/ArticleListWrapper';
import ArticleCardsSkeleton from './_components/ArticleCardsSkeleton';
import { checkIsAdmin } from '@/lib/auth-utils';

export default async function ArticlesPage() {
  const isAdmin = await checkIsAdmin();

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-07.webp" />
      <ContentsLayout>
        <Header
          title="아티클"
          showNotification
        />

        <div className="w-full py-4">
          {/* 검색 및 업로드 버튼 영역 - 즉시 렌더링 */}
          <div className="mt-4 mb-6 flex items-center justify-between">
            <div className="w-full max-w-xs">
              <SearchInput
                placeholder="기사 검색"
              />
            </div>
            {isAdmin && (
              <UploadButton
                link="/articles/upload"
                title="기사 등록"
              />
            )}
          </div>

          {/* 아티클 목록 - Suspense로 감싸서 로딩 처리 */}
          <Suspense fallback={<ArticleCardsSkeleton />}>
            <ArticleListWrapper />
          </Suspense>
        </div>
      </ContentsLayout>
    </>
  );
}
