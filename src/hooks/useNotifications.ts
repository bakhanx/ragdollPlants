import { useCallback } from 'react';
import { useNotificationStore } from '@/stores/notificationStore';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '@/app/actions/notifications';

export const useNotifications = () => {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    setNotifications,
    setLoading,
    setError,
    markAsRead: markAsReadInStore,
    markAllAsRead: markAllAsReadInStore
  } = useNotificationStore();

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { notifications, unreadCount } = await getNotifications();
      setNotifications(notifications, unreadCount);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('Failed to fetch notifications:', err);
    }
  }, [setNotifications, setLoading, setError]);

  const markAsRead = useCallback(async (notificationId: string) => {
    // Optimistic 업데이트
    markAsReadInStore(notificationId);

    try {
      await markNotificationAsRead(notificationId);
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      // 실패 시 다시 fetch해서 정확한 상태로 복구
      await fetchNotifications();
    }
  }, [markAsReadInStore, fetchNotifications]);

  const markAllAsRead = useCallback(async () => {
    // Optimistic 업데이트
    markAllAsReadInStore();

    try {
      await markAllNotificationsAsRead();
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
      // 실패 시 다시 fetch해서 정확한 상태로 복구
      await fetchNotifications();
    }
  }, [markAllAsReadInStore, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };
};