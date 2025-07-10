import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { ContentService, ContentType } from '@/app/_services/contentService';

/**
 * 콘텐츠 수정/삭제 액션을 처리하는 훅
 */
export const useContentActions = (contentType: ContentType, id: string) => {
  const router = useRouter();

  const handleEdit = useCallback(() => {
    try {
      const editPath = ContentService.getEditPath(contentType, id);
      router.push(editPath);
    } catch (error) {
      console.error('수정 페이지 이동 오류:', error);
      alert(error instanceof Error ? error.message : '수정 페이지로 이동할 수 없습니다.');
    }
  }, [contentType, id, router]);

  const handleDelete = useCallback(async () => {
    try {
      await ContentService.deleteContent(contentType, id);
      // 삭제 함수들이 redirect를 하므로 별도의 성공 처리는 불필요
    } catch (error) {
      console.error('삭제 오류:', error);
      alert(error instanceof Error ? error.message : '삭제에 실패했습니다.');
    }
  }, [contentType, id]);

  return {
    handleEdit,
    handleDelete
  };
}; 