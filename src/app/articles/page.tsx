import BackgroundImage from '../_components/layout/BackgroundImage';
import { ContentsLayout } from '../_components/layout/ContentsLayout';
import { Header } from '../_components/header/Header';
import { articleItems } from '../_temp/articleData';
import ArticleList from './_components/ArticleList';

export default function ArticlesPage() {
  return (
    <>
      <BackgroundImage src="/images/welcome-bg-04.webp" />
      <ContentsLayout>
        <Header
          title="식물 관련 기사"
          showNotification
        />
        <ArticleList initialArticles={articleItems} />
      </ContentsLayout>
    </>
  );
}
