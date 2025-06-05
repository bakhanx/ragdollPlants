import React, { useState } from 'react';
import { TermsModal } from './TermsModal';
import { type TermsType, termsDisplayNames, termsRequired } from './terms-metadata';

interface TermsAgreementProps {
  agreements: {
    service: boolean;
    privacy: boolean;
    age: boolean;
    marketing: boolean;
  };
  onAgreementChange: (type: keyof TermsAgreementProps['agreements']) => void;
  onAllAgreementChange: (checked: boolean) => void;
  isAllRequiredAgreed: boolean;
}

export const TermsAgreement: React.FC<TermsAgreementProps> = ({
  agreements,
  onAgreementChange,
  onAllAgreementChange,
  isAllRequiredAgreed
}) => {
  // 모달 상태 관리
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: TermsType | null;
  }>({
    isOpen: false,
    type: null
  });

  // 모달 열기
  const openModal = (type: TermsType) => {
    setModalState({ isOpen: true, type });
  };

  // 모달 닫기
  const closeModal = () => {
    setModalState({ isOpen: false, type: null });
  };

  return (
    <>
      <div className="w-full py-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-3">
          {/* 전체 동의 */}
          <div className="border-b border-white/20 pb-3">
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="agree-all"
                checked={isAllRequiredAgreed}
                onChange={(e) => onAllAgreementChange(e.target.checked)}
                className="rounded border-white/30 bg-white/10 text-green-500"
              />
              <label htmlFor="agree-all" className="text-white font-medium">
                아래 약관에 모두 동의합니다
              </label>
            </div>
            {!isAllRequiredAgreed && (
              <p className="text-xs text-red-400 mt-1 ml-6">
                필수 약관에 모두 동의해주세요
              </p>
            )}
          </div>

          {/* 필수 약관들 */}
          <div className="space-y-2">
            {/* 서비스 이용약관 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="terms-service"
                  checked={agreements.service}
                  onChange={() => onAgreementChange('service')}
                  className="rounded border-white/30 bg-white/10 text-green-500"
                />
                <label htmlFor="terms-service" className="text-sm text-white">
                  <span className="text-red-400">[필수]</span> {termsDisplayNames.service}
                </label>
              </div>
              <button 
                type="button"
                className="text-xs text-white/70 underline hover:text-white transition-colors"
                onClick={() => openModal('service')}
              >
                전문보기
              </button>
            </div>

            {/* 개인정보 처리방침 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="terms-privacy"
                  checked={agreements.privacy}
                  onChange={() => onAgreementChange('privacy')}
                  className="rounded border-white/30 bg-white/10 text-green-500"
                />
                <label htmlFor="terms-privacy" className="text-sm text-white">
                  <span className="text-red-400">[필수]</span> {termsDisplayNames.privacy}
                </label>
              </div>
              <button 
                type="button"
                className="text-xs text-white/70 underline hover:text-white transition-colors"
                onClick={() => openModal('privacy')}
              >
                전문보기
              </button>
            </div>

            {/* 만 14세 이상 확인 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="terms-age"
                  checked={agreements.age}
                  onChange={() => onAgreementChange('age')}
                  className="rounded border-white/30 bg-white/10 text-green-500"
                />
                <label htmlFor="terms-age" className="text-sm text-white">
                  <span className="text-red-400">[필수]</span> 만 14세 이상 이용 확인
                </label>
              </div>
            </div>

            {/* 선택 약관 */}
            <div className="pt-2 border-t border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="terms-marketing"
                    checked={agreements.marketing}
                    onChange={() => onAgreementChange('marketing')}
                    className="rounded border-white/30 bg-white/10 text-green-500"
                  />
                  <label htmlFor="terms-marketing" className="text-sm text-white">
                    <span className="text-blue-400">[선택]</span> {termsDisplayNames.marketing}
                  </label>
                </div>
                <button 
                  type="button"
                  className="text-xs text-white/70 underline hover:text-white transition-colors"
                  onClick={() => openModal('marketing')}
                >
                  전문보기
                </button>
              </div>
              <p className="text-xs text-white/60 mt-1 ml-6">
                식물 관리 팁, 이벤트 등의 유용한 정보를 받아보세요
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 모달 */}
      {modalState.isOpen && modalState.type && (
        <TermsModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          type={modalState.type}
        />
      )}
    </>
  );
}; 