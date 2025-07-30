'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-utils';

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
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('인증되지 않은 사용자입니다.');
  }

  const notification = await prisma.notification.findUnique({
    where: { id: notificationId }
  });

  if (!notification || notification.recipientId !== session.user.id) {
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

  revalidatePath('/mygarden');
  revalidatePath('/articles');

  return updatedNotification;
}

/**
 * 현재 사용자의 모든 알림을 읽음 상태로 변경
 */
export async function markAllNotificationsAsRead() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('인증되지 않은 사용자입니다.');
  }

  await prisma.notification.updateMany({
    where: {
      recipientId: session.user.id,
      isRead: false
    },
    data: {
      isRead: true
    }
  });

  revalidatePath('/mygarden');
  revalidatePath('/articles');
}
