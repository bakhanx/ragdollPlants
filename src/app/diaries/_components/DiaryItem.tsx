import Link from 'next/link';
import Pin from './Pin';
import Image from 'next/image';
import { DiaryItemProps } from '@/types/components/diaries';
import { formatDate } from '@/app/_utils/dateUtils';
import { GRAY_PLACEHOLDER } from '@/app/_constants/imagePlaceholders';

export default function DiaryItem({ post, index }: DiaryItemProps) {
  return (
    <Link
      href={`/diaries/${post.id}`}
      className="relative block rounded-lg border border-amber-100 bg-white/80 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
      {/* 핀 컴포넌트 */}
      <Pin index={index} />

      <article className="relative flex h-[280px] flex-col">
        {/* 이미지 영역 */}
        <div className="relative h-32 w-full overflow-hidden">
          <div className="absolute inset-0 bg-amber-50/50"></div>
          <Image
            src={post.image ? `${post.image}/small` : '/images/default-img.webp'}
            alt={post.title}
            fill
            placeholder="blur"
            blurDataURL={GRAY_PLACEHOLDER}
            className="rounded-t-lg object-cover"
            priority
            unoptimized
          />

          {/* 날짜 스티커 */}
          <div className="absolute top-3 right-3 rotate-3 rounded-lg border border-amber-200 bg-white/90 px-2 py-1 text-xs font-medium text-amber-700 shadow-sm">
            {formatDate(post.date)}
          </div>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="flex-1 overflow-hidden bg-[linear-gradient(transparent_0px,transparent_16px,#c8ccd0_17px)] bg-[size:100%_18px] p-4 pt-2">
          <h2 className="mb-3 line-clamp-1 rounded bg-amber-50/70 px-1 py-1 text-lg font-bold text-gray-800">
            {post.title}
          </h2>

          <div className="relative">
            <p className="mb-4 line-clamp-5 overflow-hidden px-1 text-sm leading-[18px] font-medium text-gray-700">
              {post.content}
            </p>

            {/* 접착 테이프 효과 */}
            <div className="absolute -top-2 left-1/2 h-2 w-16 -translate-x-1/2 transform rounded-full bg-amber-100/70"></div>
          </div>
        </div>
      </article>
    </Link>
  );
}
