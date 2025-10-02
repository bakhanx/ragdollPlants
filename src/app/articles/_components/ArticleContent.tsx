import React from 'react';
import CategoryBadge from './CategoryBadge';
import { ArticleCategory } from '@/types/models/article';

interface ArticleContentProps {
  article: {
    title: string;
    author?: string;
    date: string;
    content: string;
    category: ArticleCategory;
    tags?: string[];
  };
}

export default function ArticleContent({ article }: ArticleContentProps) {
  return (
    <div className="relative z-10 -mt-10 min-h-[calc(40vh+40px)] rounded-t-3xl bg-white/90 sm:p-8 p-6 shadow-lg backdrop-blur-sm">
      <div className="absolute top-2 right-4 z-20">
        <CategoryBadge category={article.category} />
      </div>
      <h1 className="pt-2 text-xl sm:text-2xl font-bold text-gray-800">{article.title}</h1>

      <div className="mb-6 flex items-center justify-between pt-12">
        <span className="sm:text-sm text-xs font-medium text-gray-500">
          작성자: {article.author || '익명'}
        </span>
        <time className="text-end sm:text-sm text-xs text-gray-500">{article.date}</time>
      </div>

      {article.tags && article.tags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {article.tags.map(tag => (
            <span
              key={tag}
              className="rounded-full bg-violet-200 sm:px-3 sm:py-1 sm:text-xs px-2 py-0.5 text-[10px] font-semibold text-violet-800">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div
        className="prose prose-green max-w-none sm:text-base text-sm leading-relaxed break-words [&_*]:break-words [&_div]:break-words [&_p]:break-words [&_p:empty]:min-h-[1.5em] [&_p:empty]:my-2 [&_p:empty]:block"
        style={{
          overflowWrap: 'anywhere',
          wordBreak: 'break-word',
          hyphens: 'auto'
        }}
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </div>
  );
}
