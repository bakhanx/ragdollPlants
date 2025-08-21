'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface UploadButtonProps {
  link?: string;
  disabled?: boolean;
  count?: number;
  maxCount?: number;
  className?: string;
  title?: string;
  type?: 'galleries' | 'diaries' | 'myplants' | 'events' | 'articles';
  isLoggedIn?: boolean;
}

export const UploadButton = ({
  link,
  disabled = false,
  count,
  maxCount,
  className = '',
  title = '등록',
  type,
  isLoggedIn = true
}: UploadButtonProps) => {
  const router = useRouter();

  // type에 따른 기본 링크 설정
  const getDefaultLink = () => {
    if (link) return link;
    switch (type) {
      case 'galleries':
        return '/galleries/upload';
      case 'diaries':
        return '/diaries/upload';
      case 'myplants':
        return '/myplants/upload';
      case 'events':
        return '/events/upload';
      case 'articles':
        return '/articles/upload';
      default:
        return '#';
    }
  };

  const finalLink = getDefaultLink();

  const handleClick = (e: React.MouseEvent) => {
    // type이 있으면 로그인 체크
    if (type && !isLoggedIn) {
      e.preventDefault();
      if (confirm('로그인 페이지로 이동하시겠습니까?')) {
        router.push('/login');
      }
    }
  };
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {disabled ? (
        <button
          className="flex aspect-square w-10 cursor-not-allowed items-center justify-center rounded-md border-2 border-gray-300 bg-gray-500 text-xl text-white"
          disabled
          title={title + ' (최대 개수 도달)'}>
          <span className="text-2xl">+</span>
        </button>
      ) : (
        <Link
          href={finalLink}
          onClick={handleClick}
          className="flex aspect-square w-10 items-center justify-center rounded-md border-2 border-gray-300 text-xl text-white hover:bg-green-700"
          title="업로드">
          <span className="text-2xl">+</span>
        </Link>
      )}
      {typeof count === 'number' && typeof maxCount === 'number' && (
        <span className="mt-1 text-xs text-gray-300">
          {count} / {maxCount}
        </span>
      )}
    </div>
  );
};
