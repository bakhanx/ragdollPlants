import { Suspense } from 'react';
import BackgroundImage from '../_components/layout/BackgroundImage';
import { ContentsLayout } from '../_components/layout/ContentsLayout';
import { Header } from '../_components/header/Header';
import { SearchInput } from '../_components/common/SearchInput';
import { UploadButton } from '../_components/common/UploadButton';
import DiaryListWrapper from './_components/DiaryListWrapper';
import DiaryCardsSkeleton from './_components/DiaryCardsSkeleton';

interface DiariesPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function DiariesPage({ searchParams }: DiariesPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const searchQuery = params.search || '';

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-06.webp" />
      <ContentsLayout>
        <Header
          title="식물 일기"
          showNotification
        />

        <div className="w-full py-4">
          <div className="py-8">
            {/* 검색 및 업로드 버튼 영역 - 즉시 렌더링 */}
            <div className="mt-4 mb-6 flex justify-between">
              <div className="w-full max-w-xs">
                <SearchInput
                  placeholder="일기 제목 검색"
                  defaultValue={searchQuery}
                />
              </div>
              <UploadButton
                link="/diaries/upload"
                title="일기 작성"
                maxCount={99}
              />
            </div>

            {/* 다이어리 목록 - Suspense로 감싸서 로딩 처리 */}
            <Suspense fallback={<DiaryCardsSkeleton />}>
              <DiaryListWrapper
                currentPage={currentPage}
                searchQuery={searchQuery}
              />
            </Suspense>
          </div>
        </div>
      </ContentsLayout>
    </>
  );
}
