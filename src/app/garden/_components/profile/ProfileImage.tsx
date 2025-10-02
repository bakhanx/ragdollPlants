import Image from 'next/image';
import { EditIcon } from '@/app/_components/icons';
import { PROFILE_PLACEHOLDER } from '@/app/_constants/imagePlaceholders';
import { getImageSrc } from '@/app/_utils/imageUtils';

type ProfileImageProps = {
  src: string | null | undefined;
  alt: string;
  className?: string;
  showEditHint?: boolean;
};

export default function ProfileImage({
  src,
  alt,
  className = '',
  showEditHint = false
}: ProfileImageProps) {
  console.log(src);
  return (
    <div className="shrink-0">
      <div
        className={`relative overflow-hidden rounded-2xl border-2 border-green-200 shadow-lg sm:size-28 size-24 ${className} group mt-1`}>
        <Image
          src={src ? getImageSrc(src, 'small') : '/images/default-img.webp'}
          alt={alt}
          fill
          placeholder="blur"
          blurDataURL={PROFILE_PLACEHOLDER}
          className="object-cover"
          priority
          unoptimized
        />

        {showEditHint && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex flex-col items-center gap-1 text-white">
              <EditIcon
                size={24}
                className="[&_path]:stroke-white"
              />
              <span className="text-xs font-medium">프로필 편집</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
