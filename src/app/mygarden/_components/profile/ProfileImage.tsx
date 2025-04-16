import Image from 'next/image';
import { EditIcon } from '@/app/_components/icons';

type ProfileImageProps = {
  src: string;
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
  return (
    <div className="shrink-0">
      <div
        className={`relative size-20 overflow-hidden rounded-2xl border-2 border-green-200 shadow-lg sm:size-24 ${className} group`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 80px, 96px"
          className="object-cover"
          priority
        />
        
        {showEditHint && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex flex-col items-center gap-1 text-white">
              <EditIcon size={24} className="[&_path]:stroke-white" />
              <span className="text-xs font-medium">프로필 편집</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 