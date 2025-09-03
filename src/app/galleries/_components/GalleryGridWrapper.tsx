import { getUserGalleries } from '@/app/actions/galleries';
import { GalleryGrid } from './GalleryGrid';
import { UploadButton } from '@/app/_components/common/UploadButton';
import { AuthMismatchHandler } from '@/app/_components/auth/AuthMismatchHandler';

export async function GalleryGridWrapper() {
  let galleriesResult: Awaited<ReturnType<typeof getUserGalleries>> | null =
    null;
  let hasError = false;

  try {
    galleriesResult = await getUserGalleries();
  } catch (error) {
    console.error('갤러리 데이터 로딩 오류:', error);
    hasError = true;
    galleriesResult = null;
  }

  if (hasError) {
    return (
      <div className="mx-auto w-full max-w-md px-4 pb-20">
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-center">
          <p className="text-red-600">
            갤러리 데이터를 불러오는 중 오류가 발생했습니다.
          </p>
          <p className="text-sm text-red-500">페이지를 새로고침해 주세요.</p>
        </div>
      </div>
    );
  }

  const galleryData = galleriesResult
    ? {
        galleries: galleriesResult.galleries,
        isOwner: galleriesResult.isOwner
      }
    : null;

  const isLoggedIn = galleriesResult?.isLoggedIn || false;
  
  // 세션-DB 불일치 감지
  if (galleriesResult?.authMismatch) {
    return <AuthMismatchHandler />;
  }

  return (
    <div>
      {/* 업로드 버튼  */}
      <div className="absolute top-22 right-4 z-10">
        <UploadButton
          type="galleries"
          isLoggedIn={isLoggedIn}
        />
      </div>

      {/* 갤러리 그리드 */}
      <GalleryGrid
        initialData={galleryData}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
}
