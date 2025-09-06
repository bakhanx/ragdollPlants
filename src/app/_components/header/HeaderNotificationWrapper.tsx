'use client';

import { useEffect, useState } from 'react';
import { getNotifications } from '@/app/actions/notifications';
import { HeaderNotifications } from './HeaderNotifications';
import { BellIcon } from '../icons';

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
    return (
      <div
        className="absolute flex size-9 items-center justify-center rounded-xl bg-white/50 transition-all cursor-wait"
        aria-label="알림">
        <BellIcon
          size={20}
          className="[&>path]:stroke-gray-700"
        />
      </div>
    );
  }

  return <HeaderNotifications notifications={notifications} />;
};
