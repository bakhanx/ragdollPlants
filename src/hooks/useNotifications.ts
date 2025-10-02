'use client';

import { useCallback, useState, useEffect } from 'react';
import { useNotificationStore } from '@/stores/notificationStore';
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getNotificationsByPeriod
} from '@/app/actions/notifications';
import type { Notification } from '@prisma/client';

export const useNotifications = () => {
  const {
    unreadCount,
    setUnreadCount,
    decrementUnreadCount,
    resetUnreadCount
  } = useNotificationStore();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 개별 액션별 로딩 상태
  const [actionLoadingStates, setActionLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});

  // 읽지 않은 카운트 fetch
  const fetchUnreadCount = useCallback(async () => {
    try {
      const { unreadCount } = await getUnreadCount();
      setUnreadCount(unreadCount);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
      // 에러 시 0으로 설정
      setUnreadCount(0);
    }
  }, [setUnreadCount]);

  // 알림 데이터 fetch (알림창 열 때마다 새로 가져오기)
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { notifications, unreadCount } = await getNotifications();

      // 로컬 알림 데이터 업데이트
      setNotifications(notifications);

      // Store 카운트 동기화
      setUnreadCount(unreadCount);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('Failed to fetch notifications:', err);

      // 에러 시 빈 결과로 설정
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, [setUnreadCount]);

  // Optimistic 알림 읽음 처리
  const markAsRead = useCallback(
    async (notificationId: string) => {
      // 중복 요청 방지
      if (actionLoadingStates[`read-${notificationId}`]) return;

      // 이미 읽은 알림이면 스킵
      const targetNotification = notifications.find(
        n => n.id === notificationId
      );
      if (!targetNotification || targetNotification.isRead) return;

      try {
        // 로딩 상태 시작
        setActionLoadingStates(prev => ({
          ...prev,
          [`read-${notificationId}`]: true
        }));

        // 카운트 감소 (Optimistic)
        decrementUnreadCount();

        // 로컬 알림 데이터 업데이트
        setNotifications(prev =>
          prev.map(n => (n.id === notificationId ? { ...n, isRead: true } : n))
        );

        // 서버 동기화
        await markNotificationAsRead(notificationId);
      } catch (err) {
        console.error('Failed to mark notification as read:', err);

        // 롤백
        await fetchNotifications();
      } finally {
        setActionLoadingStates(prev => ({
          ...prev,
          [`read-${notificationId}`]: false
        }));
      }
    },
    [
      actionLoadingStates,
      notifications,
      decrementUnreadCount,
      fetchNotifications
    ]
  );

  // 모든 알림 읽음 처리 (Optimistic)
  const markAllAsRead = useCallback(async () => {
    // 중복 요청 방지
    if (actionLoadingStates['markAllAsRead']) return;

    // 읽지 않은 알림이 없으면 스킵
    if (unreadCount === 0) return;

    try {
      setActionLoadingStates(prev => ({ ...prev, markAllAsRead: true }));

      // 카운트 0으로 리셋 (Optimistic)
      resetUnreadCount();

      // 로컬 알림 데이터 업데이트
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

      // 서버 동기화
      await markAllNotificationsAsRead();
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);

      // 롤백
      await fetchNotifications();
    } finally {
      setActionLoadingStates(prev => ({ ...prev, markAllAsRead: false }));
    }
  }, [actionLoadingStates, unreadCount, resetUnreadCount, fetchNotifications]);

  // 개별 액션 로딩 상태 확인 함수
  const isMarkingAsRead = useCallback(
    (notificationId: string) => {
      return !!actionLoadingStates[`read-${notificationId}`];
    },
    [actionLoadingStates]
  );

  const isMarkingAllAsRead = !!actionLoadingStates['markAllAsRead'];

  // Optimistic 알림 삭제
  const deleteNotif = useCallback(
    async (notificationId: string) => {
      // 중복 요청 방지
      if (actionLoadingStates[`delete-${notificationId}`]) return;

      const targetNotification = notifications.find(
        n => n.id === notificationId
      );
      if (!targetNotification) return;

      try {
        // 로딩 상태 시작
        setActionLoadingStates(prev => ({
          ...prev,
          [`delete-${notificationId}`]: true
        }));

        // 읽지 않은 상태였다면 카운트 감소 (Optimistic)
        if (!targetNotification.isRead) {
          decrementUnreadCount();
        }

        // 로컬에서 알림 제거 (Optimistic)
        setNotifications(prev => prev.filter(n => n.id !== notificationId));

        // 서버 동기화
        await deleteNotification(notificationId);
      } catch (err) {
        console.error('Failed to delete notification:', err);

        // 롤백
        await fetchNotifications();
      } finally {
        setActionLoadingStates(prev => ({
          ...prev,
          [`delete-${notificationId}`]: false
        }));
      }
    },
    [
      actionLoadingStates,
      notifications,
      decrementUnreadCount,
      fetchNotifications
    ]
  );

  // 개별 삭제 로딩 상태 확인
  const isDeletingNotification = useCallback(
    (notificationId: string) => {
      return !!actionLoadingStates[`delete-${notificationId}`];
    },
    [actionLoadingStates]
  );

  return {
    // 데이터
    notifications,
    unreadCount,

    // 로딩 상태
    isLoading,
    error,
    isMarkingAsRead,
    isMarkingAllAsRead,
    isDeletingNotification,

    // 액션
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification: deleteNotif
  };
};

type PaginatedNotificationsPeriod = {
  page: number;
  notifications: Notification[];
  periodLabel: string;
};

type UseNotificationsPaginatedReturn = {
  periods: PaginatedNotificationsPeriod[];
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  loadMore: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
};

export function useNotificationsPaginated(): UseNotificationsPaginatedReturn {
  const [periods, setPeriods] = useState<PaginatedNotificationsPeriod[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadInitial = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getNotificationsByPeriod(0);
      setPeriods([{
        page: 0,
        notifications: result.notifications,
        periodLabel: result.periodLabel
      }]);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = periods.length;
      const result = await getNotificationsByPeriod(nextPage);
      
      setPeriods(prev => [...prev, {
        page: nextPage,
        notifications: result.notifications,
        periodLabel: result.periodLabel
      }]);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Failed to load more notifications:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, periods.length]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await markNotificationAsRead(id);
      // 로컬 상태 업데이트
      setPeriods(prev => prev.map(period => ({
        ...period,
        notifications: period.notifications.map(notification =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        )
      })));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  return {
    periods,
    hasMore,
    loading,
    loadingMore,
    loadMore,
    markAsRead,
    refresh: loadInitial
  };
}
