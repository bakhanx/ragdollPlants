import { Metadata } from 'next';

// 기본 사이트 정보
export const SITE_CONFIG = {
  name: '랙돌플랜츠',
  nameEn: 'RagdollPlants',
  url: 'https://www.ragdollplants.site',
  description: '랙돌플랜츠에서 당신의 식물을 더 건강하게 관리하세요. 물주기 알림, 식물 다이어리, 식물 커뮤니티까지 - 식물 관리 전문 플랫폼',
  keywords: ['랙돌플랜츠', '식물관리', '식물키우기', '화분', '반려식물', '식물다이어리', '물주기', '식물커뮤니티', 'ragdollplants'] as string[],
  creator: '랙돌플랜츠',
  publisher: '랙돌플랜츠',
  authors: [{ name: 'RagdollPlants Team' }] as { name: string }[],
};

// 공통 메타데이터 설정
const commonMetadata = {
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    other: {
      'naver-site-verification': 'your-naver-verification-code',
    },
  },
} as const;

// 메타데이터 생성 함수
export function createMetadata({
  title,
  description = SITE_CONFIG.description,
  keywords = SITE_CONFIG.keywords,
  url = SITE_CONFIG.url,
  images,
}: {
  title: string;
  description?: string;
  keywords?: string[];
  url?: string;
  images?: string[];
}): Metadata {
  const fullTitle = title.includes(SITE_CONFIG.name) ? title : `${title} - ${SITE_CONFIG.name}`;
  
  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: SITE_CONFIG.authors,
    creator: SITE_CONFIG.creator,
    publisher: SITE_CONFIG.publisher,
    ...commonMetadata,
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      url,
      title: fullTitle,
      description,
      siteName: SITE_CONFIG.name,
      images: images ? images.map(img => ({
        url: img,
        width: 1200,
        height: 630,
        alt: fullTitle,
      })) : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: images?.[0],
    },
    alternates: {
      canonical: url,
    },
  };
}

// 페이지별 메타데이터 설정
export const PAGE_METADATA = {
  home: createMetadata({
    title: `${SITE_CONFIG.name}(${SITE_CONFIG.nameEn}) - 식물 관리의 모든 것`,
    url: SITE_CONFIG.url,
  }),
  
  articles: createMetadata({
    title: '식물 기사 - 전문 식물 관리 가이드',
    description: `${SITE_CONFIG.name}에서 전문가가 제공하는 식물 관리 가이드와 유용한 정보를 확인하세요. 식물 키우기, 물주기, 병충해 관리까지`,
    keywords: [...SITE_CONFIG.keywords, '식물기사', '식물가이드', '식물전문지식'],
    url: `${SITE_CONFIG.url}/articles`,
  }),
  
  galleries: createMetadata({
    title: '식물 갤러리 - 아름다운 식물 사진',
    description: `${SITE_CONFIG.name} 사용자들이 공유하는 아름다운 식물 사진 갤러리를 관람하세요. 식물 사진, 화분 디자인, 식물 커뮤니티`,
    keywords: [...SITE_CONFIG.keywords, '식물갤러리', '식물사진', '화분사진', '식물공유', '반려식물사진'],
    url: `${SITE_CONFIG.url}/galleries`,
  }),
  
  diaries: createMetadata({
    title: '식물 일기 - 식물 성장 기록',
    description: `${SITE_CONFIG.name}에서 당신의 식물 성장 이야기를 기록하고 공유하세요. 식물 다이어리, 성장 기록, 식물 일지`,
    keywords: [...SITE_CONFIG.keywords, '식물일기', '식물성장기록', '식물일지', '식물관찰', '반려식물다이어리'],
    url: `${SITE_CONFIG.url}/diaries`,
  }),
  
  care: createMetadata({
    title: '식물 케어 - 물주기 알림 및 관리',
    description: `${SITE_CONFIG.name}에서 당신의 식물에게 적절한 케어를 제공하세요. 자동 물주기 알림, 영양 관리, 식물 케어 스케줄`,
    keywords: [...SITE_CONFIG.keywords, '식물케어', '물주기알림', '식물영양관리', '식물관리스케줄', '식물기르기', '반려식물케어'],
    url: `${SITE_CONFIG.url}/care`,
  }),
  
  events: createMetadata({
    title: '식물 이벤트 - 커뮤니티 활동',
    description: `${SITE_CONFIG.name} 커뮤니티 이벤트에 참여하세요. 식물 챙린지, 커뮤니티 활동, 식물 공유 이벤트`,
    keywords: [...SITE_CONFIG.keywords, '식물이벤트', '식물커뮤니티', '식물챙린지', '식물공유이벤트', '반려식물이벤트', '식물모임'],
    url: `${SITE_CONFIG.url}/events`,
  }),
} as const;
