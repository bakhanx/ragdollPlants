'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser, requireAuth } from '@/lib/auth-utils';

export async function getUnreadCount(): Promise<{ unreadCount: number }> {
  const session = await getCurrentUser();

  // 로그인하지 않은 경우 0 반환
  if (!session?.id) {
    return { unreadCount: 0 };
  }

  const unreadCount = await prisma.notification.count({
    where: {
      recipientId: session.id,
      isRead: false
    }
  });

  return { unreadCount };
}

/**
 * 현재 로그인된 사용자의 알림 목록
 * @param limit 가져올 알림 수 (기본값: 10)
 * @param cursor 페이징을 위한 커서 ID
 */
export async function getNotifications(limit: number = 10, cursor?: string) {
  const session = await getCurrentUser();

  // 로그인하지 않은 경우 빈 결과 반환
  if (!session?.id) {
    return {
      notifications: [],
      unreadCount: 0,
      nextCursor: undefined
    };
  }

  const notifications = await prisma.notification.findMany({
    where: {
      recipientId: session.id
    },
    take: limit,
    ...(cursor && {
      cursor: {
        id: cursor
      },
      skip: 1
    }),
    orderBy: {
      createdAt: 'desc'
    }
  });

  const unreadCount = await prisma.notification.count({
    where: {
      recipientId: session.id,
      isRead: false
    }
  });

  return {
    notifications,
    unreadCount,
    nextCursor:
      notifications.length === limit ? notifications[limit - 1].id : undefined
  };
}

/**
 * 특정 알림을 읽음 상태로 변경
 * @param notificationId 읽음 처리할 알림의 ID
 */
export async function markNotificationAsRead(notificationId: string) {
  const user = await requireAuth();

  const notification = await prisma.notification.findUnique({
    where: { id: notificationId }
  });

  if (!notification || notification.recipientId !== user.id) {
    throw new Error('알림을 찾을 수 없거나 권한이 없습니다.');
  }

  const updatedNotification = await prisma.notification.update({
    where: {
      id: notificationId
    },
    data: {
      isRead: true
    }
  });

  return updatedNotification;
}

/**
 * 현재 사용자의 모든 알림을 읽음 상태로 변경
 */
export async function markAllNotificationsAsRead() {
  const user = await requireAuth();

  await prisma.notification.updateMany({
    where: {
      recipientId: user.id,
      isRead: false
    },
    data: {
      isRead: true
    }
  });
}

/**
 * 특정 알림 삭제
 * @param notificationId 삭제할 알림의 ID
 */
export async function deleteNotification(notificationId: string) {
  const user = await requireAuth();

  const notification = await prisma.notification.findUnique({
    where: { id: notificationId }
  });

  if (!notification || notification.recipientId !== user.id) {
    throw new Error('알림을 찾을 수 없거나 권한이 없습니다.');
  }

  await prisma.notification.delete({
    where: {
      id: notificationId
    }
  });

  // 삭제된 알림이 읽지 않은 상태였다면 true 반환 (카운트 감소용)
  return { wasUnread: !notification.isRead };
}

/**
 * 14일 주기 기반 알림 목록 조회
 * @param page 0: 최근 14일, 1: 15-28일 전, 2: 29-42일 전...
 */
export async function getNotificationsByPeriod(page: number = 0) {
  const session = await getCurrentUser();

  if (!session?.id) {
    return {
      notifications: [],
      hasMore: false,
      periodLabel: ''
    };
  }

  // 14일 단위로 날짜 범위 계산
  const now = new Date();
  const startDaysAgo = page * 14;
  const endDaysAgo = (page + 1) * 14;

  const startDate = new Date(now);
  startDate.setDate(now.getDate() - endDaysAgo);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(now);
  endDate.setDate(now.getDate() - startDaysAgo);
  endDate.setHours(23, 59, 59, 999);

  const notifications = await prisma.notification.findMany({
    where: {
      recipientId: session.id,
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // 다음 페이지가 있는지 확인
  const nextPageStart = new Date(now);
  nextPageStart.setDate(now.getDate() - (endDaysAgo + 14));

  const hasMore =
    (await prisma.notification.count({
      where: {
        recipientId: session.id,
        createdAt: {
          lt: startDate
        }
      }
    })) > 0;

  // 기간 라벨 생성
  let periodLabel = '';
  if (page === 0) {
    periodLabel = '최근 14일';
  } else {
    const startDays = startDaysAgo + 1;
    const endDays = endDaysAgo;
    periodLabel = `${startDays}-${endDays}일 전`;
  }

  return {
    notifications,
    hasMore,
    periodLabel
  };
}
