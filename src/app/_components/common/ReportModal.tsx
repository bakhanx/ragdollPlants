'use client';

import { useState } from 'react';
import { Button } from './Button';
import { Textarea } from './Textarea';

// 신고 사유 옵션
const REPORT_REASONS = [
  { value: 'spam', label: '스팸/홍보' },
  { value: 'inappropriate', label: '부적절한 내용' },
  { value: 'harassment', label: '괴롭힘' },
  { value: 'fake', label: '허위 정보' },
  { value: 'copyright', label: '저작권 침해' },
  { value: 'other', label: '기타' }
] as const;

export type ReportReason = typeof REPORT_REASONS[number]['value'];

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: ReportReason, description?: string) => Promise<void>;
  contentType: 'article' | 'diary' | 'gallery' | 'event' | 'plant';
  isSubmitting?: boolean;
}

export const ReportModal = ({
  isOpen,
  onClose,
  onSubmit,
  contentType,
  isSubmitting = false
}: ReportModalProps) => {
  const [selectedReason, setSelectedReason] = useState<ReportReason | ''>('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    if (!selectedReason) {
      alert('신고 사유를 선택해주세요.');
      return;
    }

    try {
      await onSubmit(selectedReason, description || undefined);
      // 성공 시 모달 리셋
      setSelectedReason('');
      setDescription('');
      onClose();
    } catch (error) {
      console.error('신고 제출 오류:', error);
    }
  };

  const handleClose = () => {
    setSelectedReason('');
    setDescription('');
    onClose();
  };

  if (!isOpen) return null;

  const getContentTypeLabel = () => {
    const labels = {
      article: '게시물',
      diary: '다이어리',
      gallery: '갤러리',
      event: '이벤트',
      plant: '식물'
    };
    return labels[contentType];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 오버레이 */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />
      
      {/* 모달 컨텐츠 */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-lg">
        <div className="p-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {getContentTypeLabel()} 신고하기
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={isSubmitting}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 안내 메시지 */}
          <p className="text-sm text-gray-600 mb-4">
            부적절한 콘텐츠를 신고해 주세요. 신고 내용은 관리자가 검토한 후 처리됩니다.
          </p>

          {/* 신고 사유 선택 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              신고 사유 *
            </label>
            <div className="space-y-2">
              {REPORT_REASONS.map((reason) => (
                <label key={reason.value} className="flex items-center">
                  <input
                    type="radio"
                    name="reason"
                    value={reason.value}
                    checked={selectedReason === reason.value}
                    onChange={(e) => setSelectedReason(e.target.value as ReportReason)}
                    className="mr-2 text-green-600 focus:ring-green-500"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm text-gray-700">{reason.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 상세 설명 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상세 설명 (선택사항)
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="신고 사유에 대한 추가 설명을 입력해주세요..."
              rows={3}
              className="w-full"
              disabled={isSubmitting}
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <Button
              onClick={handleClose}
              className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
              disabled={isSubmitting}>
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={isSubmitting || !selectedReason}>
              {isSubmitting ? '신고 중...' : '신고하기'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 