import { NotificationType } from '@prisma/client';

/**
 * 알림 템플릿 데이터 인터페이스
 */
interface NotificationTemplateData {
  // 공통
  userName?: string;
  plantName?: string;
  contentTitle?: string;
  
  // 케어 관련
  isOverdue?: boolean;
  overdueDays?: number;
  isReminder?: boolean;
  
  // 소셜 관련
  actorName?: string;
  contentType?: 'article' | 'diary' | 'gallery' | 'plant';
  
  // 레벨/성취 관련
  currentLevel?: number;
  newLevel?: number;
  achievementName?: string;
  experiencePoints?: number;
  
  // 신고 관련
  reportStatus?: 'approved' | 'rejected' | 'pending';
  reportReason?: string;
  
  // 업로드 관련
  uploadType?: 'image' | 'profile' | 'plant';
  errorMessage?: string;
}

/**
 * 알림 템플릿 반환 타입
 */
interface NotificationTemplate {
  title: string;
  message: string;
}

/**
 * 알림 타입별 템플릿 생성 함수
 */
export function createNotificationTemplate(
  type: NotificationType,
  data: NotificationTemplateData = {}
): NotificationTemplate {
  switch (type) {
    case 'PLANT_CARE_WATER':
      return createPlantWaterTemplate(data);
    
    case 'PLANT_CARE_NUTRIENT':
      return createPlantNutrientTemplate(data);
    
    case 'CONTENT_LIKED':
      return createContentLikedTemplate(data);
    
    case 'NEW_COMMENT':
      return createNewCommentTemplate(data);
    
    case 'UPLOAD_SUCCESS':
      return createUploadSuccessTemplate(data);
    
    case 'UPLOAD_FAILED':
      return createUploadFailedTemplate(data);
    
    case 'REPORT_STATUS_CHANGED':
      return createReportStatusTemplate(data);
    
    case 'ADMIN_MESSAGE':
      return createAdminMessageTemplate(data);
    
    case 'GENERAL':
    default:
      return createGeneralTemplate(data);
  }
}

/**
 * 물주기 알림 템플릿
 */
function createPlantWaterTemplate(data: NotificationTemplateData): NotificationTemplate {
  const { plantName = '식물', isOverdue = false, overdueDays = 0, isReminder = false } = data;

  if (isReminder) {
    return {
      title: '🔔 내일 물주기 예정',
      message: `${plantName}에 내일 물을 줘야 해요!`
    };
  }

  if (isOverdue && overdueDays > 0) {
    return {
      title: '🚨 물주기 지연!',
      message: `${plantName}의 물주기가 ${overdueDays}일 지연되었어요. 지금 물을 주세요!`
    };
  }

  return {
    title: '💧 물주기 시간',
    message: `${plantName}에 물을 줄 시간이에요!`
  };
}

/**
 * 영양제 알림 템플릿
 */
function createPlantNutrientTemplate(data: NotificationTemplateData): NotificationTemplate {
  const { plantName = '식물', isOverdue = false, overdueDays = 0, isReminder = false } = data;

  if (isReminder) {
    return {
      title: '🔔 내일 영양제 예정',
      message: `${plantName}에 내일 영양제를 줘야 해요!`
    };
  }

  if (isOverdue && overdueDays > 0) {
    return {
      title: '🚨 영양제 지연!',
      message: `${plantName}의 영양제가 ${overdueDays}일 지연되었어요. 지금 영양제를 주세요!`
    };
  }

  return {
    title: '🌿 영양제 시간',
    message: `${plantName}에 영양제를 줄 시간이에요!`
  };
}

/**
 * 좋아요 알림 템플릿
 */
function createContentLikedTemplate(data: NotificationTemplateData): NotificationTemplate {
  const { actorName = '누군가', contentType = 'plant', contentTitle = '콘텐츠' } = data;

  const contentTypeKorean = {
    article: '아티클',
    diary: '다이어리',
    gallery: '갤러리',
    plant: '식물'
  }[contentType];

  return {
    title: '❤️ 새로운 좋아요',
    message: `${actorName}님이 회원님의 ${contentTypeKorean} "${contentTitle}"을(를) 좋아합니다!`
  };
}

/**
 * 댓글 알림 템플릿
 */
function createNewCommentTemplate(data: NotificationTemplateData): NotificationTemplate {
  const { actorName = '누군가', contentTitle = '아티클' } = data;

  return {
    title: '💬 새로운 댓글',
    message: `${actorName}님이 "${contentTitle}"에 댓글을 남겼습니다.`
  };
}

/**
 * 업로드 성공 알림 템플릿
 */
function createUploadSuccessTemplate(data: NotificationTemplateData): NotificationTemplate {
  const { uploadType = 'image', contentTitle = '콘텐츠' } = data;

  const uploadTypeKorean = {
    image: '이미지',
    profile: '프로필 사진',
    plant: '식물 사진'
  }[uploadType];

  return {
    title: '✅ 업로드 완료',
    message: `${uploadTypeKorean} 업로드가 성공적으로 완료되었습니다.`
  };
}

/**
 * 업로드 실패 알림 템플릿
 */
function createUploadFailedTemplate(data: NotificationTemplateData): NotificationTemplate {
  const { uploadType = 'image', errorMessage = '알 수 없는 오류가 발생했습니다.' } = data;

  const uploadTypeKorean = {
    image: '이미지',
    profile: '프로필 사진',
    plant: '식물 사진'
  }[uploadType];

  return {
    title: '❌ 업로드 실패',
    message: `${uploadTypeKorean} 업로드에 실패했습니다. ${errorMessage}`
  };
}

/**
 * 신고 상태 변경 알림 템플릿
 */
function createReportStatusTemplate(data: NotificationTemplateData): NotificationTemplate {
  const { reportStatus = 'pending', reportReason = '신고', contentTitle = '콘텐츠' } = data;

  switch (reportStatus) {
    case 'approved':
      return {
        title: '⚖️ 신고 처리 완료',
        message: `신고하신 콘텐츠 "${contentTitle}"에 대한 조치가 완료되었습니다.`
      };
    
    case 'rejected':
      return {
        title: '📋 신고 검토 완료',
        message: `신고하신 콘텐츠 "${contentTitle}"는 커뮤니티 가이드라인에 위반되지 않는 것으로 판단되었습니다.`
      };
    
    default:
      return {
        title: '📨 신고 접수',
        message: `신고가 접수되었습니다. 검토 후 결과를 알려드리겠습니다.`
      };
  }
}

/**
 * 관리자 메시지 알림 템플릿
 */
function createAdminMessageTemplate(data: NotificationTemplateData): NotificationTemplate {
  return {
    title: '📢 관리자 공지',
    message: data.contentTitle || '새로운 공지사항이 있습니다.'
  };
}

/**
 * 일반 알림 템플릿
 */
function createGeneralTemplate(data: NotificationTemplateData): NotificationTemplate {
  return {
    title: data.contentTitle || '알림',
    message: data.contentTitle || '새로운 알림이 있습니다.'
  };
}

/**
 * 케어 완료 알림 템플릿 (즉시 생성용)
 */
export function createCareCompletionTemplate(
  careType: 'water' | 'nutrient',
  plantName: string,
  experiencePoints?: number
): NotificationTemplate {
  const careTypeKorean = careType === 'water' ? '물주기' : '영양제';
  const icon = careType === 'water' ? '💧' : '🌿';
  
  let message = `${plantName}에 ${careTypeKorean}를 완료했습니다!`;
  if (experiencePoints) {
    message += ` (+${experiencePoints} EXP)`;
  }

  return {
    title: `${icon} ${careTypeKorean} 완료`,
    message
  };
}

/**
 * 레벨업 알림 템플릿
 */
export function createLevelUpTemplate(
  newLevel: number,
  experiencePoints: number
): NotificationTemplate {
  return {
    title: '🎉 레벨업!',
    message: `축하합니다! 레벨 ${newLevel}에 도달했습니다! (+${experiencePoints} EXP)`
  };
}

/**
 * 팔로우 알림 템플릿
 */
export function createFollowTemplate(followerName: string): NotificationTemplate {
  return {
    title: '👤 새로운 팔로워',
    message: `${followerName}님이 회원님을 팔로우하기 시작했습니다!`
  };
}
