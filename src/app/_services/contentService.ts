import { deleteArticle } from '@/app/actions/articles';
import { deleteDiary } from '@/app/actions/diaries';
import { deleteGallery } from '@/app/actions/galleries';
import { deleteEvent } from '@/app/actions/events';
import { deletePlant } from '@/app/actions/plants';
import {
  validateDiaryOwnership,
  validateGalleryOwnership,
  validatePlantOwnership,
  getCurrentUser,
  checkIsAdmin
} from '@/lib/auth-utils';

export type ContentType = 'article' | 'diary' | 'event' | 'plant' | 'gallery';

interface ContentConfig {
  editPath: (id: string) => string;
  deleteAction: (id: string) => Promise<unknown>;
  validateOwnership?: (id: string, userId: string) => Promise<unknown>;
  requiresAdmin?: boolean; // 관리자 권한이 필요한지 여부
  idType: 'string' | 'number';
}

// 콘텐츠 타입별 설정
const CONTENT_CONFIG: Record<ContentType, ContentConfig> = {
  article: {
    editPath: (id: string) => `/articles/${id}/edit`,
    deleteAction: (id: string) => deleteArticle(parseInt(id)),
    requiresAdmin: true, // 관리자만 수정/삭제 가능
    idType: 'number'
  },
  diary: {
    editPath: (id: string) => `/diaries/${id}/edit`,
    deleteAction: (id: string) => deleteDiary(id),
    validateOwnership: (id: string, userId: string) =>
      validateDiaryOwnership(id, userId),
    idType: 'string'
  },
  gallery: {
    editPath: (id: string) => `/galleries/${id}/edit`,
    deleteAction: (id: string) => deleteGallery(id),
    validateOwnership: (id: string, userId: string) =>
      validateGalleryOwnership(id, userId),
    idType: 'string'
  },
  event: {
    editPath: (id: string) => `/events/${id}/edit`,
    deleteAction: (id: string) => deleteEvent(parseInt(id)),
    requiresAdmin: true, // 관리자만 수정/삭제 가능
    idType: 'number'
  },
  plant: {
    editPath: (id: string) => `/myplants/${id}/edit`,
    deleteAction: (id: string) => deletePlant(id),
    validateOwnership: (id: string, userId: string) =>
      validatePlantOwnership(id, userId),
    idType: 'string'
  }
} as const;

/**
 * 콘텐츠 관련 비즈니스 로직을 처리하는 서비스
 */
export class ContentService {
  /**
   * 콘텐츠 타입과 ID를 기반으로 수정 페이지 경로를 반환
   */
  static getEditPath(contentType: ContentType, id: string): string {
    const config = CONTENT_CONFIG[contentType];
    if (!config) {
      throw new Error(`지원하지 않는 콘텐츠 타입: ${contentType}`);
    }
    return config.editPath(id);
  }

  /**
   * 콘텐츠를 삭제
   */
  static async deleteContent(
    contentType: ContentType,
    id: string
  ): Promise<void> {
    const config = CONTENT_CONFIG[contentType];
    if (!config) {
      throw new Error(`지원하지 않는 콘텐츠 타입: ${contentType}`);
    }

    try {
      await config.deleteAction(id);
    } catch (error) {
      console.error(`${contentType} 삭제 오류:`, error);
      throw error;
    }
  }

  /**
   * 콘텐츠 타입이 유효한지 검증
   */
  static isValidContentType(contentType: string): contentType is ContentType {
    return Object.keys(CONTENT_CONFIG).includes(contentType);
  }

  /**
   * 특정 콘텐츠 타입의 ID 타입을 반환
   */
  static getIdType(contentType: ContentType): 'string' | 'number' {
    return CONTENT_CONFIG[contentType]?.idType || 'string';
  }

  /**
   * 현재 사용자가 콘텐츠를 수정/삭제할 권한이 있는지 확인
   */
  static async checkPermission(
    contentType: ContentType,
    contentId: string
  ): Promise<boolean> {
    try {
      const config = CONTENT_CONFIG[contentType];

      if (!config) {
        throw new Error(`지원하지 않는 콘텐츠 타입: ${contentType}`);
      }

      // 관리자 권한이 필요한 콘텐츠 (article, event)
      if (config.requiresAdmin) {
        return await checkIsAdmin();
      }

      // 소유자 권한이 필요한 콘텐츠 (diary, gallery, plant)
      if (config.validateOwnership) {
        const user = await getCurrentUser();
        if (!user) return false;
        await config.validateOwnership(contentId, user.id);
        return true;
      }

      return false;
    } catch (error) {
      // 권한이 없거나 로그인하지 않은 경우
      return false;
    }
  }
}
