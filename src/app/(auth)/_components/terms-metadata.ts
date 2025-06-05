export interface TermsMetadata {
  version: string;
  lastUpdated: string;
  effectiveDate: string;
  summary: string;
}

export const termsMetadata: Record<'service' | 'privacy' | 'marketing', TermsMetadata> = {
  service: {
    version: '1.0',
    lastUpdated: '2024-06-05',
    effectiveDate: '2024-06-05',
    summary: 'RagdollPlants 서비스 이용에 관한 기본 약관입니다.'
  },
  privacy: {
    version: '1.0',
    lastUpdated: '2024-06-05',
    effectiveDate: '2024-06-05',
    summary: '개인정보 수집, 이용, 보관 및 파기에 관한 방침입니다.'
  },
  marketing: {
    version: '1.0',
    lastUpdated: '2024-06-05',
    effectiveDate: '2024-06-05',
    summary: '마케팅 정보 수신 동의 및 관련 혜택에 대한 안내입니다.'
  }
};

// 약관 타입 정의
export type TermsType = 'service' | 'privacy' | 'marketing';

// 약관 표시 이름
export const termsDisplayNames: Record<TermsType, string> = {
  service: '서비스 이용약관',
  privacy: '개인정보 처리방침',
  marketing: '마케팅 정보 수신 동의'
};

// 약관 필수 여부
export const termsRequired: Record<TermsType, boolean> = {
  service: true,
  privacy: true,
  marketing: false
}; 