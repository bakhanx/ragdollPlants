import { getArticles } from '@/app/actions/articles';
import { checkIsAdmin } from '@/lib/auth-utils';
import ArticleList from './ArticleList';

export default async function ArticleListWrapper() {
  let articles: Awaited<ReturnType<typeof getArticles>> = [];
  let isAdmin = false;
  let hasError = false;

  try {
    [articles, isAdmin] = await Promise.all([getArticles(), checkIsAdmin()]);
  } catch (error) {
    console.error('아티클 목록 로딩 오류:', error);
    hasError = true;
  }

  if (hasError) {
    return (
      <div className="mb-4 rounded-lg bg-red-50 p-4 text-center">
        <p className="text-red-600">
          아티클 데이터를 불러오는 중 오류가 발생했습니다.
        </p>
        <p className="text-sm text-red-500">페이지를 새로고침해 주세요.</p>
      </div>
    );
  }

  const allArticles = articles;
  const tipsArticles = articles.filter(a => a.category === 'tips');
  const newsArticles = articles.filter(a => a.category === 'news');
  const guideArticles = articles.filter(a => a.category === 'guide');

  return (
    <ArticleList
      allArticles={allArticles}
      tipsArticles={tipsArticles}
      newsArticles={newsArticles}
      guideArticles={guideArticles}
      isAdmin={isAdmin}
    />
  );
}
