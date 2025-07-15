import React from 'react';
import { ArticleList } from './ArticleList';
import { getLatestArticles } from '@/app/actions/articles';

const ARTICLE_COUNT = 3;

export async function ArticleListWrapper() {
  const latestArticles = await getLatestArticles(ARTICLE_COUNT);
  return <ArticleList items={latestArticles} />;
}
