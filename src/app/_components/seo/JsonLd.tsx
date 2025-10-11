import Script from 'next/script';
import { SITE_CONFIG } from '../../_constants/seoMetadata';

interface OrganizationData {
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[];
}

interface WebsiteData {
  name: string;
  url: string;
  description: string;
  potentialAction: {
    '@type': string;
    target: string;
    'query-input': string;
  };
}

interface JsonLdProps {
  type: 'organization' | 'website';
  data: OrganizationData | WebsiteData;
}

export function JsonLd({ type, data }: JsonLdProps) {
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': type === 'organization' ? 'Organization' : 'WebSite',
    ...data,
  };

  return (
    <Script
      id={`json-ld-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
    />
  );
}

// 홈페이지용 통합 JSON-LD 컴포넌트
export function HomeJsonLd() {
  const organizationData: OrganizationData = {
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: 'https://imagedelivery.net/214BxOnlVKSU2amZRZmdaQ/30f09674-2e2a-4810-8a4f-b4f59618b400/logo',
    description: SITE_CONFIG.description,
    sameAs: [
      // 소셜 미디어나 관련 링크들 (나중에 추가)
    ],
  };

  const websiteData: WebsiteData = {
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_CONFIG.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <JsonLd type="organization" data={organizationData} />
      <JsonLd type="website" data={websiteData} />
    </>
  );
}
