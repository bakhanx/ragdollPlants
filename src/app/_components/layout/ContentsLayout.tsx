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
      className={`relative z-10 flex min-h-[80vh] w-full max-w-md flex-col items-center my-2 mx-2 rounded-2xl bg-white/10 shadow-lg backdrop-blur-xl ${noPadding ? '' : 'px-4 py-4'} `}>
      {children}
    </div>
  );
}
