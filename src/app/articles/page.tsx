import BackgroundImage from '../_components/layout/BackgroundImage';
import ContentLayout from '../_components/layout/ContentsLayout';
import Header from '../_components/layout/Header';
import FloatingButton from '@/app/_components/common/UploadButton';
import { articleItems } from '../_temp/articleData';
import ArticleList from './_components/ArticleList';

export default function ArticlesPage() {
  return (
    <>
      <BackgroundImage src="/images/welcome-bg-04.webp" />
      <ContentLayout>
        <Header
          title="식물 관련 기사"
          showNotification
        />
        <ArticleList initialArticles={articleItems} />
      </ContentLayout>
      <FloatingButton
        link="/articles/upload"
        adminOnly={true}
      />
    </>
  );
}
