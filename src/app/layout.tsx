import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { NavigationScrollManager } from './_components/utils/navigationScrollManager';
import { ScrollToTopButton } from './_components/common/ScrollToTopButton';
import { AuthProvider } from './_components/AuthProvider';
import { HomeJsonLd } from './_components/seo/JsonLd';
import { PAGE_METADATA } from './_constants/seoMetadata';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = PAGE_METADATA.home;

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* 배경 이미지 우선 로딩 */}
        <link
          rel="preload"
          href="/images/welcome-bg-07.webp"
          as="image"
          type="image/webp"
        />
      </head>
      <body className="">
        {/* JSON-LD 구조화된 데이터 */}
        <HomeJsonLd />
        
        <AuthProvider>
          <main className="relative flex min-h-screen items-center justify-center">
            {children}
          </main>
          <ScrollToTopButton />
          <NavigationScrollManager />
        </AuthProvider>
      </body>
    </html>
  );
}
