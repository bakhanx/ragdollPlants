import { deleteArticle } from '@/app/actions/articles';
import { deleteDiary } from '@/app/actions/diaries';
import { deleteGallery } from '@/app/actions/galleries';
import { deleteEvent } from '@/app/actions/events';
import { deletePlant } from '@/app/actions/plants';

export type ContentType = 'article' | 'diary' | 'event' | 'plant' | 'gallery';

interface ContentConfig {
  editPath: (id: string) => string;
  deleteAction: (id: string) => Promise<unknown>;
  idType: 'string' | 'number';
}

// 콘텐츠 타입별 설정
const CONTENT_CONFIG: Record<ContentType, ContentConfig> = {
  article: {
    editPath: (id: string) => `/articles/${id}/edit`,
    deleteAction: (id: string) => deleteArticle(parseInt(id)),
    idType: 'number'
  },
  diary: {
    editPath: (id: string) => `/diaries/${id}/edit`,
    deleteAction: (id: string) => deleteDiary(id),
    idType: 'string'
  },
  gallery: {
    editPath: (id: string) => `/galleries/${id}/edit`,
    deleteAction: (id: string) => deleteGallery(id),
    idType: 'string'
  },
  event: {
    editPath: (id: string) => `/events/${id}/edit`,
    deleteAction: (id: string) => deleteEvent(parseInt(id)),
    idType: 'number'
  },
  plant: {
    editPath: (id: string) => `/myplants/${id}/edit`,
    deleteAction: (id: string) => deletePlant(id),
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
  static async deleteContent(contentType: ContentType, id: string): Promise<void> {
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
} 