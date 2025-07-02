'use client';

import { SignOutIcon } from '@/app/_components/icons';
import { signOutAction } from '@/app/actions/auth';

export default function LogoutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="rounded-full bg-red-400/80 p-2 shadow-sm transition-colors hover:bg-red-400/100"
        aria-label="로그아웃">
        <SignOutIcon
          size={20}
          className="text-white"
        />
      </button>
    </form>
  );
} 