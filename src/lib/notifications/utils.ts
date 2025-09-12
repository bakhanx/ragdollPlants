'use server';

import { prisma } from '@/lib/prisma';
import { NotificationType } from '@prisma/client';
import {
  createCareCompletionTemplate,
  createLevelUpTemplate,
  createFollowTemplate,
  createNotificationTemplate
} from './templates';
import { revalidateTag } from 'next/cache';
import { CacheTags } from '@/lib/cache/cacheTags';
import type {
  CreateNotificationData,
  CreateLikeNotificationParams,
  CreateCommentNotificationParams,
  UploadType,
  CreateReportStatusNotificationParams,
  CreateAdminMessageNotificationParams,
  DuplicateNotificationCheckParams
} from '@/types/notifications';

/**
 * 알림 생성 기본 함수
 */
async function createNotification(data: CreateNotificationData) {
  const {
    type,
    title,
    message,
    link,
    recipientId,
    actorId,
    plantId,
    articleId,
    diaryId,
    galleryId,
    commentId,
    reportId
  } = data;
  try {
    const notification = await prisma.notification.create({
      data: {
        type,
        title,
        message,
        link,
        recipientId,
        actorId,
        plantId,
        articleId,
        diaryId,
        galleryId,
        commentId,
        reportId,
        isRead: false
      }
    });

    // 알림 캐시 무효화
    revalidateTag(CacheTags.notifications(recipientId));

    return notification;
  } catch (error) {
    console.error('알림 생성 중 오류:', error);
    throw error;
  }
}

/**
 * 케어 완료 알림 생성
 */
export async function createCareCompletionNotification(
  userId: string,
  plantId: string,
  plantName: string,
  careType: 'water' | 'nutrient',
  experiencePoints?: number
) {
  const template = createCareCompletionTemplate(
    careType,
    plantName,
    experiencePoints
  );

  return await createNotification({
    type: 'GENERAL',
    title: template.title,
    message: template.message,
    link: `/care`,
    recipientId: userId,
    plantId
  });
}

/**
 * 레벨업 알림 생성
 */
export async function createLevelUpNotification(
  userId: string,
  newLevel: number,
  experiencePoints: number
) {
  const template = createLevelUpTemplate(newLevel, experiencePoints);

  return await createNotification({
    type: 'GENERAL',
    title: template.title,
    message: template.message,
    link: `/garden/${userId}`,
    recipientId: userId
  });
}

/**
 * 팔로우 알림 생성
 */
export async function createFollowNotification(
  recipientId: string,
  actorId: string,
  followerName: string
) {
  const template = createFollowTemplate(followerName);

  return await createNotification({
    type: 'GENERAL',
    title: template.title,
    message: template.message,
    link: `/garden/${actorId}`,
    recipientId,
    actorId
  });
}

/**
 * 좋아요 알림 생성
 */
export async function createLikeNotification(
  params: CreateLikeNotificationParams
) {
  const {
    recipientId,
    actorId,
    actorName,
    contentType,
    contentId,
    contentTitle
  } = params;
  // 자기 자신에게는 알림을 보내지 않음
  if (recipientId === actorId) {
    return null;
  }

  const template = createNotificationTemplate('CONTENT_LIKED', {
    actorName,
    contentType,
    contentTitle
  });

  const linkMap = {
    article: `/articles/${contentId}`,
    diary: `/diaries/${contentId}`,
    gallery: `/galleries/${contentId}`,
    plant: `/myplants/${contentId}`
  };

  const notificationData: CreateNotificationData = {
    type: 'CONTENT_LIKED',
    title: template.title,
    message: template.message,
    link: linkMap[contentType],
    recipientId,
    actorId
  };

  // 콘텐츠 타입에 따라 관련 ID 설정
  switch (contentType) {
    case 'article':
      notificationData.articleId = Number(contentId);
      break;
    case 'diary':
      notificationData.diaryId = String(contentId);
      break;
    case 'gallery':
      notificationData.galleryId = String(contentId);
      break;
    case 'plant':
      notificationData.plantId = String(contentId);
      break;
  }

  return await createNotification(notificationData);
}

/**
 * 댓글 알림 생성
 */
export async function createCommentNotification(
  params: CreateCommentNotificationParams
) {
  const {
    recipientId,
    actorId,
    actorName,
    articleId,
    articleTitle,
    commentId
  } = params;
  // 자기 자신에게는 알림을 보내지 않음
  if (recipientId === actorId) {
    return null;
  }

  const template = createNotificationTemplate('NEW_COMMENT', {
    actorName,
    contentTitle: articleTitle
  });

  return await createNotification({
    type: 'NEW_COMMENT',
    title: template.title,
    message: template.message,
    link: `/articles/${articleId}#comment-${commentId}`,
    recipientId,
    actorId,
    articleId,
    commentId
  });
}

/**
 * 업로드 성공 알림 생성
 */
export async function createUploadSuccessNotification(
  userId: string,
  uploadType: UploadType,
  contentTitle?: string,
  contentId?: string
) {
  const template = createNotificationTemplate('UPLOAD_SUCCESS', {
    uploadType,
    contentTitle
  });

  let link = '/';
  if (uploadType === 'plant' && contentId) {
    link = `/myplants/${contentId}`;
  } else if (uploadType === 'profile') {
    link = `/garden/${userId}`;
  }

  return await createNotification({
    type: 'UPLOAD_SUCCESS',
    title: template.title,
    message: template.message,
    link,
    recipientId: userId,
    ...(uploadType === 'plant' && contentId && { plantId: contentId })
  });
}

/**
 * 업로드 실패 알림 생성
 */
export async function createUploadFailedNotification(
  userId: string,
  uploadType: UploadType,
  errorMessage: string
) {
  const template = createNotificationTemplate('UPLOAD_FAILED', {
    uploadType,
    errorMessage
  });

  return await createNotification({
    type: 'UPLOAD_FAILED',
    title: template.title,
    message: template.message,
    recipientId: userId
  });
}

/**
 * 신고 상태 변경 알림 생성
 */
export async function createReportStatusNotification(
  params: CreateReportStatusNotificationParams
) {
  const { recipientId, reportId, reportStatus, contentTitle } = params;
  const template = createNotificationTemplate('REPORT_STATUS_CHANGED', {
    reportStatus,
    contentTitle
  });

  return await createNotification({
    type: 'REPORT_STATUS_CHANGED',
    title: template.title,
    message: template.message,
    recipientId,
    reportId
  });
}

/**
 * 관리자 메시지 알림 생성 (전체 또는 특정 사용자)
 */
export async function createAdminMessageNotification(
  params: CreateAdminMessageNotificationParams
) {
  const { recipientIds, title, message, link } = params;
  let targetUserIds: string[];

  if (recipientIds === 'all') {
    // 모든 활성 사용자에게 전송
    const activeUsers = await prisma.user.findMany({
      where: { isActive: true },
      select: { id: true }
    });
    targetUserIds = activeUsers.map(user => user.id);
  } else {
    targetUserIds = recipientIds;
  }

  const notifications = targetUserIds.map(userId => ({
    type: 'ADMIN_MESSAGE' as NotificationType,
    title,
    message,
    link,
    recipientId: userId,
    isRead: false
  }));

  // 일괄 생성
  const createdNotifications = await prisma.notification.createMany({
    data: notifications
  });

  // 각 사용자별 캐시 무효화
  targetUserIds.forEach(userId => {
    revalidateTag(CacheTags.notifications(userId));
  });

  return createdNotifications;
}

/**
 * 중복 알림 방지 체크
 */
export async function isDuplicateNotification(
  params: DuplicateNotificationCheckParams
): Promise<boolean> {
  const {
    type,
    recipientId,
    actorId,
    plantId,
    articleId,
    timeWindowHours = 1
  } = params;
  const timeWindow = new Date();
  timeWindow.setHours(timeWindow.getHours() - timeWindowHours);

  const existingNotification = await prisma.notification.findFirst({
    where: {
      type,
      recipientId,
      actorId: actorId || undefined,
      plantId: plantId || undefined,
      articleId: articleId || undefined,
      createdAt: {
        gte: timeWindow
      }
    }
  });

  return !!existingNotification;
}
