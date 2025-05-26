import { inferArticleCategory } from '@/app/_utils/categoryUtils';
import Link from 'next/link';
import { useMemo } from 'react';
import CategoryBadge from './CategoryBadge';
import { ArticleWithNumberId } from '@/types/models/article';
import Image from 'next/image';
/**
 * 개별 기사 아이템 컴포넌트 (최적화를 위해 분리)
 */
export const ArticleItem = ({ post }: { post: ArticleWithNumberId }) => {
  // post.category가 없으면 카테고리 추론
  const category = useMemo(() => {
    return (
      post.category || inferArticleCategory(post.title, post.content, post.tags)
    );
  }, [post.category, post.title, post.content, post.tags]);

  // 이미지 소스 설정
  const imageSource = post.image || '';

  return (
    <Link
      href={`/articles/${post.id}`}
      className="block overflow-hidden rounded-2xl bg-white/50 shadow-sm transition-all hover:bg-white/60 hover:shadow-md">
      <article className="relative">
        {/* 이미지 */}
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={imageSource}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* 카테고리 배지 - 오른쪽 상단에 표시 */}
          <div className="absolute top-2 right-2 z-10">
            <CategoryBadge category={category} />
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="p-4">
          <h2 className="mb-2 line-clamp-2 text-lg font-bold text-gray-800">
            {post.title}
          </h2>
          <p className="mb-3 line-clamp-2 text-sm text-gray-600">
            {post.content}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div>{post.author?.name && `by ${post.author.name}`}</div>
            <div>{post.date}</div>
          </div>
        </div>
      </article>
    </Link>
  );
};
