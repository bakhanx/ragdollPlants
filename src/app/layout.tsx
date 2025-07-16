import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { NavigationScrollManager } from './_components/utils/navigationScrollManager';
import { ScrollToTopButton } from './_components/common/ScrollToTopButton';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'RagdollPlants - 식물 관리의 모든 것',
  description: '당신의 식물을 더 건강하게 관리할 수 있는 서비스'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="">
        <main className="relative flex min-h-screen items-center justify-center">
          {children}
        </main>
        <ScrollToTopButton />
        {/* <NavigationScrollManager /> */}
      </body>
    </html>
  );
}
