import { NotificationType } from '@prisma/client';

/**
 * 알림 생성을 위한 기본 데이터 타입
 */
export interface CreateNotificationData {
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  recipientId: string;
  actorId?: string;
  plantId?: string;
  articleId?: number;
  diaryId?: string;
  galleryId?: string;
  commentId?: string;
  reportId?: string;
}

/**
 * 좋아요 알림을 위한 콘텐츠 타입
 */
export type LikeableContentType = 'article' | 'diary' | 'gallery' | 'plant';

/**
 * 좋아요 알림 생성 매개변수
 */
export interface CreateLikeNotificationParams {
  recipientId: string;
  actorId: string;
  actorName: string;
  contentType: LikeableContentType;
  contentId: string | number;
  contentTitle: string;
}

/**
 * 댓글 알림 생성 매개변수
 */
export interface CreateCommentNotificationParams {
  recipientId: string;
  actorId: string;
  actorName: string;
  articleId: number;
  articleTitle: string;
  commentId: string;
}

/**
 * 업로드 타입
 */
export type UploadType = 'image' | 'profile' | 'plant';

/**
 * 신고 상태 타입
 */
export type ReportStatus = 'approved' | 'rejected' | 'pending';

/**
 * 신고 상태 변경 알림 매개변수
 */
export interface CreateReportStatusNotificationParams {
  recipientId: string;
  reportId: string;
  reportStatus: ReportStatus;
  contentTitle: string;
}

/**
 * 관리자 메시지 알림 매개변수
 */
export interface CreateAdminMessageNotificationParams {
  recipientIds: string[] | 'all';
  title: string;
  message: string;
  link?: string;
}

/**
 * 중복 알림 체크 매개변수
 */
export interface DuplicateNotificationCheckParams {
  type: NotificationType;
  recipientId: string;
  actorId?: string;
  plantId?: string;
  articleId?: number;
  timeWindowHours?: number;
}
