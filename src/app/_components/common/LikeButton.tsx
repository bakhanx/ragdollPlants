'use client';

import { useState, useTransition } from 'react';
import { HeartIcon } from '@/app/_components/icons';
import { toggleLike } from '@/app/actions/likes';

type ContentType = 'diary' | 'plant' | 'gallery';

interface LikeButtonProps {
  contentType: ContentType;
  contentId: string;
  initialLikes: number;
  initialIsLiked: boolean;
}

export default function LikeButton({
  contentType,
  contentId,
  initialLikes,
  initialIsLiked,
}: LikeButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);

  const handleClick = () => {
    startTransition(async () => {
      // Optimistic update
      setIsLiked(prev => !prev);
      setLikes(prev => (isLiked ? prev - 1 : prev + 1));
      
      const result = await toggleLike(contentType, contentId);

      if (!result.success) {
        // Revert on error
        setIsLiked(initialIsLiked);
        setLikes(initialLikes);
        // 에러 메시지 표시 (예: toast)
        console.error(result.error);
      } else {
        // 서버의 최종 상태로 업데이트 (선택적)
        // setIsLiked(result.isLiked);
        // setLikes(result.likes);
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-sm font-medium text-gray-600 shadow-sm backdrop-blur-sm transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <HeartIcon
        className={`size-5 transition-colors ${
          isLiked
            ? 'fill-red-500 text-red-500'
            : 'text-gray-400 group-hover:text-red-400'
        }`}
      />
      <span>{likes}</span>
    </button>
  );
} 