'use client';

import { useNotificationStore } from '@/stores/notificationStore';
import { Notification } from './Notification';
import { useEffect, useState } from 'react';
import { getNotifications } from '@/app/actions/notifications';
import { BellIcon } from '../icons';

export const HeaderNotifications = ({
  showNotification
}: {
  showNotification: boolean;
}) => {
  const { unreadCount } = useNotificationStore();
  const [isMounted, setIsMounted] = useState(false);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // 알림 버튼 핸들러
  const handleNotificationClick = () => {
    setIsNotificationOpen(true);
  };

  // 클라이언트 마운트 확인 및 데이터 페칭
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      getNotifications();
    }
  }, [isMounted]);

  return (
    <>
      {/* 알림 패널 */}
      <Notification
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      {/* 알림 버튼 */}
      {showNotification && (
        <button
          onClick={handleNotificationClick}
          className="group relative flex size-9 items-center justify-center rounded-xl bg-white/50 transition-all hover:bg-white/70 hover:shadow-md"
          aria-label="알림">
          <BellIcon
            size={20}
            className="[&>path]:stroke-gray-700"
          />
          {/* 읽지 않은 알림 카운트 - 마운트 후에만 표시 */}
          {isMounted && unreadCount > 0 && (
            <span className="animate-in fade-in absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white duration-200">
              {unreadCount}
            </span>
          )}
        </button>
      )}
    </>
  );
};
