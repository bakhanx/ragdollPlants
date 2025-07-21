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
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (isLoading) {
    return <div className="h-9 w-9 animate-pulse rounded-xl bg-white/30" />;
  }

  if (!notifications) {
    return null;
  }

  return <HeaderNotifications notifications={notifications} />;
};
