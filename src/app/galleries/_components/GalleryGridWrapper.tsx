import { getUserGalleries } from '@/app/actions/galleries';
import { GalleryGrid } from './GalleryGrid';

export async function GalleryGridWrapper() {
  let galleriesData: Awaited<ReturnType<typeof getUserGalleries>> | null = null;
  let hasError = false;

  try {
    galleriesData = await getUserGalleries();
  } catch (error) {
    console.error('갤러리 데이터 로딩 오류:', error);
    hasError = true;
    galleriesData = null;
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

  return <GalleryGrid initialData={galleriesData} />;
}