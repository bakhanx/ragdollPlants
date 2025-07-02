import BackgroundImage from '../_components/layout/BackgroundImage';
import { ContentsLayout } from '../_components/layout/ContentsLayout';
import { Header } from '../_components/header/Header';
import { auth } from '@/auth';
import { getArticles } from '../actions/articles';
import ArticleList from './_components/ArticleList';

export default async function ArticlesPage() {
  const session = await auth();
  const isAdmin = session?.user?.role === 'ADMIN';

  // 실제 DB에서 데이터 가져오기 (이제 구조가 일치함)
  const articles = await getArticles();

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-04.webp" />
      <ContentsLayout>
        <Header
          title="식물 관련 기사"
          showNotification
        />
        <ArticleList
          initialArticles={articles}
          isAdmin={isAdmin}
        />
      </ContentsLayout>
    </>
  );
}
