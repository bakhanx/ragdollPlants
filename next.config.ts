import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
        port: '',
        pathname: '/**'
      }
    ],
    // 이미지 최적화 설정
    formats: ['image/webp', 'image/avif'], // webp, avif 자동 변환
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7일 캐시
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // 반응형 크기들
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384] // 작은 이미지 크기들
  },

  webpack: config => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack']
    });
    return config;
  },

  experimental: {
    // Server Actions 설정 - 이미지 업로드 크기 제한 증가 (default : 1mb)
    serverActions: {
      bodySizeLimit: '10mb'
    },
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js'
        }
      }
    }
  }
};

export default nextConfig;
