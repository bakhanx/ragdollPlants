'use client';

import { SignOutIcon } from '@/app/_components/icons';
import { signOutAction } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // localStorage 청소
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }
      
      // NextAuth 로그아웃 (자동 리다이렉트)
      await signOutAction();
    } catch (error) {
      console.error('로그아웃 오류:', error);
      // 오류 발생 시 로그인 페이지로 리다이렉트
      router.push('/login');
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-full bg-red-400/80 p-2 shadow-sm transition-colors  hover:bg-red-400/100"
      aria-label="로그아웃">
      <SignOutIcon
        className="text-white size-4"
      />
    </button>
  );
}
