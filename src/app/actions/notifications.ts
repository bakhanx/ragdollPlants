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
