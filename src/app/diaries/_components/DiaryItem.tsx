import Link from 'next/link';
import Pin from './Pin';
import Image from 'next/image';
import { DiaryItemProps } from '@/types/components/diaries';

export default function DiaryItem({ post, index }: DiaryItemProps) {
  return (
    <Link
      href={`/diaries/${post.id}`}
      className="relative block rounded-lg border border-amber-100 bg-white/80 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
      {/* 핀 컴포넌트 */}
      <Pin index={index} />

      <article className="relative">
        {/* 이미지 영역 */}
        <div className="relative h-32 w-full overflow-hidden">
          <div className="absolute inset-0 bg-amber-50/50"></div>
          <Image
            src={post.image || '/images/plant-default.png'}
            alt={post.title}
            fill
            className="rounded-t-lg object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* 날짜 스티커 */}
          <div className="absolute top-3 right-3 rotate-3 rounded-lg border border-amber-200 bg-white/90 px-2 py-1 text-xs font-medium text-amber-700 shadow-sm">
            {new Date(post.date).toLocaleDateString('ko-KR')}
          </div>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="bg-[linear-gradient(transparent_0px,transparent_16px,#c8ccd0_17px)] bg-[size:100%_18px] p-4 pt-2">
          <h2 className="mb-3 inline-block rounded bg-amber-50/70 px-1 py-1 text-lg font-bold text-gray-800">
            {post.title}
          </h2>

          <div className="relative">
            <p className="mb-4 px-1 text-sm leading-[18px] font-medium text-gray-700">
              {post.content.split(' ').length > 30
                ? post.content.split(' ').slice(0, 30).join(' ') + '...'
                : post.content}
            </p>

            {/* 접착 테이프 효과 */}
            <div className="absolute -top-2 left-1/2 h-2 w-16 -translate-x-1/2 transform rounded-full bg-amber-100/70"></div>
          </div>
        </div>
      </article>
    </Link>
  );
}
