import BackgroundImage from '../_components/layout/BackgroundImage';
import ContentLayout from '../_components/layout/ContentsLayout';
import Header from '../_components/layout/Header';
import ArticleList from './components/ArticleList';
import { articleItems } from '../_temp/articleData';
import FloatingButton from "@/app/_components/common/UploadButton";

export default function Page() {
  return (
    <>
      <BackgroundImage src="/images/welcome-bg-06.webp" />
      {/* Contents */}
      <ContentLayout>
        {/* 헤더 */}
        <Header
          title="식물 뉴스"
          showNotification
        />

        {/* 일기 목록 */}
        <div className="py-4">
          <ArticleList posts={articleItems} />
        </div>
      </ContentLayout>

      <FloatingButton link="/articles/create" adminOnly={true} />
    </>
  );
}
