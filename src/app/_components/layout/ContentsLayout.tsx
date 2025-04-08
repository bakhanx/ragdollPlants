import React from 'react';

type ContentLayoutProps = {
  children: React.ReactNode;
  noPadding?: boolean;
};

export default function ContentLayout({
  children,
  noPadding = false
}: ContentLayoutProps) {
  return (
    <div
      className={`relative z-10 mx-2 flex min-h-[calc(100vh-16px)] my-2 w-full max-w-md flex-col items-center rounded-2xl bg-white/10 shadow-lg backdrop-blur-xl ${noPadding ? '' : 'px-4 py-4'} `}>
      {children}
    </div>
  );
}
