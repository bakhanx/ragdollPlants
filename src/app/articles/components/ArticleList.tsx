import Image from 'next/image';
import Link from 'next/link';

type ArticlePost = {
  id: number;
  title: string;
  content: string;
  date: string;
  imageUrl?: string;
  image?: string;
};

type ArticleListProps = {
  posts: ReadonlyArray<ArticlePost> | ArticlePost[];
  className?: string;
};

export default function ArticleList({
  posts,
  className = ''
}: ArticleListProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {posts.map(post => (
        <Link
          key={post.id}
          href={`/articles/${post.id}`}
          className="block overflow-hidden rounded-2xl bg-white/50 shadow-sm transition-all hover:bg-white/60 hover:shadow-md">
          <article className="relative">
            {/* 이미지 */}
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={post.imageUrl || post.image || ''}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            {/* 콘텐츠 */}
            <div className="p-4">
              <h2 className="mb-2 text-lg font-bold text-gray-800">
                {post.title}
              </h2>
              <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                {post.content}
              </p>
              <div className="w-full text-end text-xs text-gray-500">
                {post.date}
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}
