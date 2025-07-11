import { create } from 'zustand';
import type { Notification } from '@prisma/client';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '@/app/actions/notifications';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: true,
  error: null,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const { notifications, unreadCount } = await getNotifications();
      set({ notifications, unreadCount, isLoading: false });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      set({ isLoading: false, error: errorMessage });
      console.error('Failed to fetch notifications:', err);
    }
  },

  markAsRead: async (notificationId: string) => {
    const originalNotifications = get().notifications;

    // Optimistic 업데이트
    set(state => ({
      notifications: state.notifications.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, get().unreadCount - 1)
    }));

    try {
      await markNotificationAsRead(notificationId);
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      // 오류 발생 시 원래 상태로 복구
      set({
        notifications: originalNotifications,
        unreadCount: get().unreadCount + 1
      });
    }
  },

  markAllAsRead: async () => {
    const originalNotifications = get().notifications;

    // Optimistic 업데이트
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, isRead: true })),
      unreadCount: 0
    }));

    try {
      await markAllNotificationsAsRead();
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
      // 오류 발생 시 원래 상태로 복구
      set({
        notifications: originalNotifications,
        unreadCount: originalNotifications.filter(n => !n.isRead).length
      });
    }
  }
}));
