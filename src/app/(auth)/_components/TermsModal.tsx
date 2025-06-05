import React from 'react';
import { useEffect } from 'react';
import { termsContent } from './terms-content';
import { termsMetadata, type TermsType } from './terms-metadata';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: TermsType;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, type }) => {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // 모달이 열렸을 때 body 스크롤 방지
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const terms = termsContent[type];
  const metadata = termsMetadata[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 모달 컨텐츠 */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[85vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{terms.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              버전 {metadata.version} | 효력발생일: {metadata.effectiveDate}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="모달 닫기"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* 약관 요약 */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <p className="text-sm text-gray-600">{metadata.summary}</p>
        </div>
        
        {/* 내용 */}
        <div className="flex-1 overflow-y-auto p-6">
          {terms.content}
        </div>
        
        {/* 푸터 */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              <p>최종 업데이트: {metadata.lastUpdated}</p>
              <p>현재 버전: {metadata.version}</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                닫기
              </button>
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 