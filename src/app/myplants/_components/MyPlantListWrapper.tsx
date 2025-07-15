import { getMyPlants } from '@/app/actions/plants';
import { PAGINATION } from '@/app/_constants/pagination';
import { MyPlantList } from './lists/MyPlantList';

interface MyPlantListWrapperProps {
  currentPage: number;
  searchQuery: string;
}

export default async function MyPlantListWrapper({
  currentPage,
  searchQuery
}: MyPlantListWrapperProps) {
  let plantsData: Awaited<ReturnType<typeof getMyPlants>> | null = null;
  let hasError = false;

  try {
    plantsData = await getMyPlants({
      page: currentPage,
      limit: PAGINATION.ITEMS_PER_PAGE,
      search: searchQuery
    });
  } catch (error) {
    console.error('식물 목록 로딩 오류:', error);
    hasError = true;
    plantsData = null;
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

  return (
    <MyPlantList
      plantsData={plantsData}
      searchQuery={searchQuery}
    />
  );
}
