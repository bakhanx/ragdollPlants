'use client';

import { useEffect, useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { HeaderNotifications } from './HeaderNotifications';
import { BellIcon } from '../icons';

export const HeaderNotificationsWrapper = () => {
  const { unreadCount, fetchUnreadCount } = useNotifications();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // 초기 마운트 시 카운트만
  useEffect(() => {
    const loadInitialCount = async () => {
      try {
        await fetchUnreadCount();
      } catch (error) {
        console.error('알림 카운트 로딩 오류:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadInitialCount();
  }, [fetchUnreadCount]);

  // 초기 로딩 중에는 스켈레톤 표시
  if (isInitialLoading) {
    return (
      <div
        className="flex size-9 cursor-wait items-center justify-center rounded-xl bg-white/50 transition-all"
        aria-label="알림 로딩 중">
        <BellIcon
          size={20}
          className="[&>path]:stroke-gray-700"
        />
      </div>
    );
  }

  return <HeaderNotifications unreadCount={unreadCount} />;
};
