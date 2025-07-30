'use client';

import { useEffect, useState } from 'react';
import { getNotifications } from '@/app/actions/notifications';
import { HeaderNotifications } from './HeaderNotifications';

export const HeaderNotificationsWrapper = () => {
  const [notifications, setNotifications] = useState<Awaited<
    ReturnType<typeof getNotifications>
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('알림 가져오기 오류:', error);
        // 에러 발생 시 빈 결과로 설정
        setNotifications({
          notifications: [],
          unreadCount: 0,
          nextCursor: undefined
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (isLoading) {
    return <div className="h-9 w-9 animate-pulse rounded-xl bg-white/30" />;
  }

  // 알림이 없거나 로그인하지 않은 경우 렌더링하지 않음
  if (!notifications || notifications.notifications.length === 0) {
    return null;
  }

  return <HeaderNotifications notifications={notifications} />;
};
