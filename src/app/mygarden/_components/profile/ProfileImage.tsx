import Image from 'next/image';

type ProfileImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export default function ProfileImage({ src, alt, className = '' }: ProfileImageProps) {
  return (
    <div className="shrink-0">
      <div className={`relative size-20 overflow-hidden rounded-2xl border-2 border-green-200 shadow-lg sm:size-24 ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 80px, 96px"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
} 