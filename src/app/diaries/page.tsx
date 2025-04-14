import BackgroundImage from '../_components/layout/BackgroundImage';
import ContentLayout from '../_components/layout/ContentsLayout';
import Header from '../_components/layout/Header';
import { diaryPosts } from '../_temp';
import DiaryList from './_components/DiaryList';


export default function Page() {
  return (
    <>
      <BackgroundImage src="/images/welcome-bg-06.webp" />
      {/* Contents */}
      <ContentLayout>
        {/* 헤더 */}
        <Header
          title="식물 일기"
          showNotification
        />

        {/* 일기 목록 */}
        <div className="py-4">
          <DiaryList posts={diaryPosts} />
        </div>
      </ContentLayout>
    </>
  );
}
