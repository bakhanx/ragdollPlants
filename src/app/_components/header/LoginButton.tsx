'use client';

import Link from 'next/link';
import { LogInIcon } from '@/app/_components/icons';

export const LoginButton = () => {
  return (
    <Link
      href="/login"
      className="flex h-9 items-center justify-center rounded-xl bg-green-700 px-2 text-sm font-medium text-white transition-all hover:bg-green-800 hover:shadow-md"
      title="로그인"
    >
      <LogInIcon size={20} className="text-white" />
    </Link>
  );
};
