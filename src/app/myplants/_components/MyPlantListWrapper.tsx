import { getMyPlants } from '@/app/actions/plants';
import { PAGINATION } from '@/app/_constants/pagination';
import { MyPlantList } from './lists/MyPlantList';
import { UploadButton } from '@/app/_components/common/UploadButton';

interface MyPlantListWrapperProps {
  currentPage: number;
  searchQuery: string;
}

export default async function MyPlantListWrapper({
  currentPage,
  searchQuery
}: MyPlantListWrapperProps) {
  let plantsResult: Awaited<ReturnType<typeof getMyPlants>> | null = null;
  let hasError = false;

  try {
    plantsResult = await getMyPlants({
      page: currentPage,
      limit: PAGINATION.ITEMS_PER_PAGE,
      search: searchQuery
    });
  } catch (error) {
    console.error('식물 목록 로딩 오류:', error);
    hasError = true;
    plantsResult = null;
  }

  if (hasError) {
    return (
      <div className="mb-4 rounded-lg bg-red-50 p-4 text-center">
        <p className="text-red-600">
          식물 데이터를 불러오는 중 오류가 발생했습니다.
        </p>
        <p className="text-sm text-red-500">페이지를 새로고침해 주세요.</p>
      </div>
    );
  }

  const isLoggedIn = plantsResult?.isLoggedIn || false;
  const plantsData = plantsResult || null;

  return (
    <div>
      {/* 업로드 버튼 */}
      <div className="absolute top-22 right-4 z-10">
        <UploadButton 
          type="myplants" 
          isLoggedIn={isLoggedIn} 
        />
      </div>
      
      {/* 식물 목록 */}
      <MyPlantList
        plantsData={plantsData}
        searchQuery={searchQuery}
      />
    </div>
  );
}
