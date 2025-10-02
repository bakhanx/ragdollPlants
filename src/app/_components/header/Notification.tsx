'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  useNotifications,
  useNotificationsPaginated
} from '@/hooks/useNotifications';
import { Icons } from '@/app/_components/icons';
import type { Notification as NotificationType } from '@prisma/client';

interface NotificationProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationIcon = ({ type }: { type: NotificationType['type'] }) => {
  switch (type) {
    case 'PLANT_CARE_WATER':
      return <Icons.Water className="h-4 w-4" />;
    case 'PLANT_CARE_NUTRIENT':
      return <Icons.Nutrient2 className="h-4 w-4" />;
    case 'NEW_ARTICLE':
    case 'NEW_COMMENT':
      return <Icons.Article className="h-4 w-4" />;
    case 'CONTENT_LIKED':
      return <Icons.Heart className="h-4 w-4" />;
    default:
      return <Icons.Bell className="h-4 w-4" />;
  }
};

const getIconBgColor = (type: NotificationType['type']) => {
  switch (type) {
    case 'PLANT_CARE_WATER':
      return 'bg-blue-100 text-blue-500';
    case 'PLANT_CARE_NUTRIENT':
      return 'bg-green-100 text-green-500';
    case 'CONTENT_LIKED':
      return 'bg-rose-100 text-rose-500';
    case 'NEW_ARTICLE':
    case 'NEW_COMMENT':
    case 'ADMIN_MESSAGE':
      return 'bg-yellow-100 text-yellow-500';
    default:
      return 'bg-gray-100 text-gray-500';
  }
};

export const Notification = ({ isOpen, onClose }: NotificationProps) => {
  const router = useRouter();
  // 전체 알림 수와 전체 동작을 위한 기본 훅
  const { unreadCount, markAllAsRead, isMarkingAllAsRead } = useNotifications();

  // 14일 주기 페이지네이션을 위한 새로운 훅
  const {
    periods,
    hasMore,
    loading,
    loadingMore,
    loadMore,
    markAsRead,
    refresh
  } = useNotificationsPaginated();

  // 알림창이 열릴 때마다 새로운 데이터 페치
  useEffect(() => {
    if (isOpen) {
      refresh();
    }
  }, [isOpen, refresh]);

  if (!isOpen) return null;

  // 알림 클릭 핸들러
  const handleNotificationClick = (notif: NotificationType) => {
    if (!notif.isRead) {
      markAsRead(notif.id); // Optimistic UI 적용
    }
    if (notif.link) {
      router.push(notif.link);
    }
    onClose();
  };

  // 모든 알림 목록 가져오기 (기간별로 분할된 데이터를 하나로 합치기)
  const allNotifications = periods.flatMap(period => period.notifications);

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="animate-in slide-in-from-right-4 fade-in-25 fixed top-16 right-4 z-50 h-[calc(100vh-6rem)] w-96 max-w-[calc(100vw-2rem)] transform rounded-2xl border bg-white/80 shadow-2xl backdrop-blur-lg transition-transform dark:border-gray-700 dark:bg-gray-800/80">
        <div className="flex h-full flex-col p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                알림
              </h2>
              {unreadCount > 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  읽지 않은 알림 {unreadCount}개
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  disabled={isMarkingAllAsRead}
                  className={`text-sm font-medium transition-colors ${
                    isMarkingAllAsRead
                      ? 'cursor-wait text-gray-400'
                      : 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
                  }`}>
                  {isMarkingAllAsRead ? '처리 중...' : '모두 읽음'}
                </button>
              )}
              <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="알림 닫기">
                <Icons.Close className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>

          <div className="flex flex-1 flex-col overflow-hidden">
            {loading ? (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                알림을 불러오는 중...
              </div>
            ) : allNotifications.length === 0 ? (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                새로운 알림이 없습니다.
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-2 overflow-y-auto pr-1">
                  {periods.map(period => (
                    <div key={period.page}>
                      {period.notifications.length > 0 && (
                        <div className="mt-4 mb-2 first:mt-0">
                          <div className="mb-2 text-xs font-medium text-gray-400 dark:text-gray-500">
                            {period.periodLabel}
                          </div>
                          {period.notifications.map(notif => {
                            return (
                              <div
                                key={notif.id}
                                onClick={() => handleNotificationClick(notif)}
                                className={`relative cursor-pointer rounded-xl p-3 transition-all hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                  notif.isRead
                                    ? 'bg-gray-50 dark:bg-gray-700/50'
                                    : 'bg-blue-50 dark:bg-blue-900/50'
                                }`}>
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${getIconBgColor(notif.type)}`}>
                                    <NotificationIcon type={notif.type} />
                                  </div>

                                  <div className="flex-1">
                                    <h3 className="font-medium text-gray-900 dark:text-gray-50">
                                      {notif.title}
                                    </h3>
                                    <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                                      {notif.message}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                      {new Date(notif.createdAt).toLocaleString(
                                        'ko-KR',
                                        {
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric',
                                          hour: 'numeric',
                                          minute: 'numeric'
                                        }
                                      )}
                                    </p>
                                  </div>

                                  {/* 읽지 않음 표시 */}
                                  {!notif.isRead && (
                                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* 더 보기 버튼 */}
                {hasMore && (
                  <div className="mt-3 flex justify-center">
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        loadingMore
                          ? 'cursor-wait bg-gray-100 text-gray-400'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}>
                      {loadingMore ? '불러오는 중...' : '더 보기'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
