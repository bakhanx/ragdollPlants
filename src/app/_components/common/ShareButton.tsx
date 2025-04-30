'use client';

import { useState } from 'react';
import { ShareIcon } from '../icons';

type ShareButtonProps = {
  url?: string;
  title?: string;
};

export const ShareButton = ({ url, title = '랙돌플랜츠' }: ShareButtonProps) => {
  const [showToast, setShowToast] = useState(false);
  
  const handleShare = async () => {
    // 공유할 URL (기본값: 현재 페이지)
    const shareUrl = url || window.location.href;
    
    try {
      // Web Share API 지원 여부 확인
      if (navigator.share) {
        await navigator.share({
          title: title,
          url: shareUrl,
        });
      } else {
        // Web Share API를 지원하지 않는 경우 URL 복사
        await navigator.clipboard.writeText(shareUrl);
        // 간단한 알림 표시
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      }
    } catch (error) {
      console.error('공유 실패:', error);
    }
  };

  return (
    <div>
      <button
        onClick={handleShare}
        className="group relative flex size-9 items-center justify-center rounded-xl bg-white/50 transition-all hover:bg-white/70 hover:shadow-md"
        aria-label="공유하기">
        <ShareIcon size={20} className="text-gray-700" />
      </button>
      
      {showToast && (
        <div className="absolute -bottom-10 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-3 py-1 text-sm text-white shadow-lg">
          링크가 복사되었습니다.
        </div>
      )}
    </div>
  );
} 