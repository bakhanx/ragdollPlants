import { getUserPlantsForCare } from '@/app/actions/care';
import { CareCardList } from './CareCardList';

export async function CareCardListWrapper() {
  let careData: Awaited<ReturnType<typeof getUserPlantsForCare>> | null = null;
  let hasError = false;

  try {
    careData = await getUserPlantsForCare();
  } catch (error) {
    console.error('케어 데이터 로딩 오류:', error);
    hasError = true;
    careData = null;
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-red-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">데이터를 불러올 수 없어요</h3>
        <p className="text-gray-500 mb-6">페이지를 새로고침해 주세요.</p>
      </div>
    );
  }

  return <CareCardList initialData={careData} />;
}