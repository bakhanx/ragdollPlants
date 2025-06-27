import BackgroundImage from '../_components/layout/BackgroundImage';
import { ContentsLayout } from '../_components/layout/ContentsLayout';
import { Header } from '../_components/header/Header';
import DiaryList from './_components/DiaryList';
import { getDiaries } from '../actions/diaries';

export default async function DiariesPage() {
  try {
    const diaries = await getDiaries();

    return (
      <>
        <BackgroundImage src="/images/welcome-bg-06.webp" />
        <ContentsLayout>
          <Header
            title="식물 일기"
            showNotification
          />
          <DiaryList initialPosts={diaries} />
        </ContentsLayout>
      </>
    );
  } catch (error) {
    console.error('다이어리 목록 로딩 오류:', error);
    return (
      <>
        <BackgroundImage src="/images/welcome-bg-06.webp" />
        <ContentsLayout>
          <Header
            title="식물 일기"
            showNotification
          />
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-50">
              다이어리를 불러오는 중 오류가 발생했습니다.
            </p>
          </div>
        </ContentsLayout>
      </>
    );
  }
}
