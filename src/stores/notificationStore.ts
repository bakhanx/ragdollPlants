import { create } from 'zustand';
import type { Notification } from '@prisma/client';

interface NotificationState {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  decrementUnreadCount: () => void;
  resetUnreadCount: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  unreadCount: 0,

  setUnreadCount: (unreadCount: number) => {
    set({ unreadCount: Math.max(0, unreadCount) });
  },

  decrementUnreadCount: () => {
    set(state => ({ unreadCount: Math.max(0, state.unreadCount - 1) }));
  },

  resetUnreadCount: () => {
    set({ unreadCount: 0 });
  }
}));
