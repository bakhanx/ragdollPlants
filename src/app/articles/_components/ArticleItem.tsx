import { inferArticleCategory } from '@/app/_utils/categoryUtils';
import { formatDate } from '@/app/_utils/dateUtils';
import Link from 'next/link';
import { useMemo } from 'react';
import CategoryBadge from './CategoryBadge';
import { CachedArticle } from '@/types/cache/article';
import Image from 'next/image';
import { getImageSrc } from '@/app/_utils/imageUtils';
/**
 * 개별 기사 아이템 컴포넌트
 */
export const ArticleItem = ({ post }: { post: CachedArticle }) => {
  const category = useMemo(() => {
    return (
      post.category?.id ||
      inferArticleCategory(post.title, post.content, post.tags)
    );
  }, [post.category?.id, post.title, post.content, post.tags]);

  // 이미지 소스 설정

  return (
    <Link
      href={`/articles/${post.id}`}
      className="block overflow-hidden rounded-2xl bg-white/50 shadow-sm transition-all hover:bg-white/60 hover:shadow-md">
      <article className="relative">
        {/* 이미지 */}
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={
              post.image
                ? getImageSrc(post.image, 'medium')
                : '/images/default-img.webp'
            }
            alt={post.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />

          {/* 카테고리 배지 */}
          <div className="absolute top-2 right-2 z-10">
            <CategoryBadge category={category} />
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="p-4">
          <h2 className="mb-2 line-clamp-1 text-base font-bold text-gray-800 sm:text-lg">
            {post.title}
          </h2>
          <p className="mb-3 line-clamp-2 text-xs text-gray-600 sm:text-sm">
            {post.summary}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div>{post.author?.name && `${post.author.name}`}</div>
            <div>{formatDate(post.createdAt)}</div>
          </div>
        </div>
      </article>
    </Link>
  );
};
