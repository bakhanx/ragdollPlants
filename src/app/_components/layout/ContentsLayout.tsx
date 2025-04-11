import React from 'react';
import Footer from './Footer';

type ContentLayoutProps = {
  children: React.ReactNode;
  noPadding?: boolean;
  showFooter?: boolean;
};

export default function ContentLayout({
  children,
  noPadding = false
}: ContentLayoutProps) {
  return (
    <div
      className={`relative z-10 mx-2 my-2 flex min-h-[calc(100vh-16px)] w-full max-w-md flex-col items-center rounded-2xl bg-white/10 shadow-lg backdrop-blur-xl ${noPadding ? '' : 'px-4 py-4'} `}>
      <div className="w-full flex-1">{children}</div>

      <div className="mt-auto w-full">
        <Footer />
      </div>
    </div>
  );
}
