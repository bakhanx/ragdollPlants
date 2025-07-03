import BackgroundImage from '../_components/layout/BackgroundImage';
import { ContentsLayout } from '../_components/layout/ContentsLayout';
import { Header } from '../_components/header/Header';
import { auth } from '@/auth';
import { getArticles } from '../actions/articles';
import ArticleList from './_components/ArticleList';

export default async function ArticlesPage() {
  const session = await auth();
  const isAdmin = session?.user?.role === 'ADMIN';

  const articles = await getArticles();

  const allArticles = articles;
  const tipsArticles = articles.filter(a => a.category === 'tips');
  const newsArticles = articles.filter(a => a.category === 'news');
  const guideArticles = articles.filter(a => a.category === 'guide');

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-04.webp" />
      <ContentsLayout>
        <Header
          title="식물 관련 기사"
          showNotification
        />
        <ArticleList
          allArticles={allArticles}
          tipsArticles={tipsArticles}
          newsArticles={newsArticles}
          guideArticles={guideArticles}
          isAdmin={isAdmin}
        />
      </ContentsLayout>
    </>
  );
}
