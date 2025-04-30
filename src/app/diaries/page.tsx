import BackgroundImage from '../_components/layout/BackgroundImage';
import { ContentsLayout } from '../_components/layout/ContentsLayout';
import { Header } from '../_components/header/Header';
import { diaryPosts } from '../_temp/diaryData';
import DiaryList from './_components/DiaryList';

export default function DiariesPage() {
  return (
    <>
      <BackgroundImage src="/images/welcome-bg-06.webp" />
      <ContentsLayout>
        <Header
          title="식물 일기"
          showNotification
        />
        <DiaryList initialPosts={diaryPosts} />
      </ContentsLayout>
    </>
  );
}
