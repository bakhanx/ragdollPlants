import BackgroundImage from '../_components/layout/BackgroundImage';
import { ContentsLayout } from '../_components/layout/ContentsLayout';
import { Header } from '../_components/header/Header';
import DiaryList from './_components/DiaryList';
import { getDiaries } from '../actions/diaries';
import { PAGINATION } from '@/app/_constants/pagination';

interface DiariesPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function DiariesPage({
  searchParams
}: DiariesPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const searchQuery = params.search || '';

  let diariesData: Awaited<ReturnType<typeof getDiaries>> | null = null;
  let hasError = false;

  try {
    diariesData = await getDiaries({
      page: currentPage,
      limit: PAGINATION.ITEMS_PER_PAGE,
      search: searchQuery
    });
  } catch (error) {
    console.error('다이어리 목록 로딩 오류:', error);
    hasError = true;
    diariesData = null;
  }

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-06.webp" />
      <ContentsLayout>
        <Header
          title="식물 일기"
          showNotification
        />

        <div className="w-full py-4">
          {/* 에러 발생 시 메시지 표시 */}
          {hasError && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-center">
              <p className="text-red-600">
                다이어리 데이터를 불러오는 중 오류가 발생했습니다.
              </p>
              <p className="text-sm text-red-500">
                페이지를 새로고침해 주세요.
              </p>
            </div>
          )}

          {/* 다이어리 목록 */}
          <DiaryList
            diariesData={diariesData}
            currentPage={currentPage}
            searchQuery={searchQuery}
          />
        </div>
      </ContentsLayout>
    </>
  );
}
