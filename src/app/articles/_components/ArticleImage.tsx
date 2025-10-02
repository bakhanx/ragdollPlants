import Image from 'next/image';
import { ShareButton } from '@/app/_components/common/ShareButton';
import { get } from 'http';
import { getImageSrc } from '@/app/_utils/imageUtils';

interface ArticleImageProps {
  imageUrl: string | null;
  title: string;
  id: string | number;
}

export default function ArticleImage({
  imageUrl,
  title,
  id
}: ArticleImageProps) {
  return (
    <div className="relative h-[calc(50vh-16px)] w-full">
      <Image
        src={imageUrl ? getImageSrc(imageUrl, "medium") : '/images/default-img.webp'}
        alt={title}
        fill
        className="rounded-xl object-cover"
        priority
        unoptimized
      />

      <div className="absolute right-4 bottom-12 z-20">
        <ShareButton
          url={`${process.env.NEXT_PUBLIC_APP_URL}/articles/${id}`}
          title={title}
        />
      </div>
      {/* 그라데이션 오버레이 추가 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
    </div>
  );
}
