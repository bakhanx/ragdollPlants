import { getDiaries } from '@/app/actions/diaries';
import { PAGINATION } from '@/app/_constants/pagination';
import DiaryList from './DiaryList';
import DiaryCardsSkeleton from './DiaryCardsSkeleton';
import { UploadButton } from '@/app/_components/common/UploadButton';
import { AuthMismatchHandler } from '@/app/_components/auth/AuthMismatchHandler';

interface DiaryListWrapperProps {
  currentPage: number;
  searchQuery: string;
}

export default async function DiaryListWrapper({
  currentPage,
  searchQuery
}: DiaryListWrapperProps) {
  let diariesResult: Awaited<ReturnType<typeof getDiaries>> | null = null;
  let hasError = false;

  try {
    diariesResult = await getDiaries({
      page: currentPage,
      limit: PAGINATION.ITEMS_PER_PAGE,
      search: searchQuery
    });
  } catch (error) {
    console.error('다이어리 목록 로딩 오류:', error);
    hasError = true;
    diariesResult = null;
  }

  if (hasError) {
    return (
      <div className="mb-4 rounded-lg bg-red-50 p-4 text-center">
        <p className="text-red-600">
          다이어리 데이터를 불러오는 중 오류가 발생했습니다.
        </p>
        <p className="text-sm text-red-500">페이지를 새로고침해 주세요.</p>
      </div>
    );
  }

  const isLoggedIn = diariesResult?.isLoggedIn || false;
  const diariesData = diariesResult?.diaries || null;
  
  // 세션-DB 불일치 감지
  if (diariesResult?.authMismatch) {
    return <AuthMismatchHandler />;
  }

  return (
    <div>
      {/* 업로드 버튼 */}
      <div className="absolute top-22 right-4 z-10">
        <UploadButton
          type="diaries"
          isLoggedIn={isLoggedIn}
        />
      </div>

      {/* 다이어리 목록 */}
      {!diariesData ? (
        <DiaryCardsSkeleton />
      ) : (
        <DiaryList
          diariesData={diariesData}
          currentPage={currentPage}
          searchQuery={searchQuery}
        />
      )}
    </div>
  );
}
