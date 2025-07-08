import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { getArticles } from '@/app/actions/articles';
import ArticleList from './_components/ArticleList';
import { checkIsAdmin } from '@/lib/auth-utils';

export default async function ArticlesPage() {
  const isAdmin = await checkIsAdmin();

  const articles = await getArticles();

  const allArticles = articles;
  const tipsArticles = articles.filter(a => a.category === 'tips');
  const newsArticles = articles.filter(a => a.category === 'news');
  const guideArticles = articles.filter(a => a.category === 'guide');

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-07.webp" />
      <ContentsLayout>
        <Header
          title="아티클"
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
