'use client';

import Link from 'next/link';

export const LoginButton = () => {
  return (
    <Link
      href="/login"
      className="flex h-9 items-center justify-center rounded-xl bg-green-600 px-4 text-sm font-medium text-white transition-all hover:bg-green-700 hover:shadow-md"
    >
      로그인
    </Link>
  );
};
