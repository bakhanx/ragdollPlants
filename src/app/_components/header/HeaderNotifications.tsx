'use client';

import { useNotificationStore } from '@/stores/notificationStore';
import { Notification } from './Notification';
import { useEffect, useState } from 'react';
import { getNotifications } from '@/app/actions/notifications';
import { BellIcon } from '../icons';

interface NotificationsProps {
  notifications: Awaited<ReturnType<typeof getNotifications>> | null;
}

export const HeaderNotifications = ({ notifications }: NotificationsProps) => {
  const { unreadCount } = useNotificationStore();
  const [isMounted, setIsMounted] = useState(false);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // 알림 데이터가 없으면 기본값 사용
  const notificationData = notifications || {
    notifications: [],
    unreadCount: 0,
    nextCursor: undefined
  };

  // 알림 버튼 핸들러
  const handleNotificationClick = () => {
    setIsNotificationOpen(true);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {/* 알림 패널 */}
      <Notification
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      {/* 알림 버튼 */}

      <button
        onClick={handleNotificationClick}
        className="group relative flex size-9 items-center justify-center rounded-xl bg-white/50 transition-all hover:bg-white/70 hover:shadow-md"
        aria-label="알림">
        <BellIcon
          size={20}
          className="[&>path]:stroke-gray-700"
        />
        {/* 읽지 않은 알림 카운트 - 마운트 후에만 표시 */}
        {isMounted && notificationData.unreadCount > 0 && (
          <span className="animate-in fade-in absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white duration-200">
            {notificationData.unreadCount}
          </span>
        )}
      </button>
    </>
  );
};
