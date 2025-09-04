'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOutAction } from '@/app/actions/auth';

export function AuthMismatchHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthMismatch = async () => {
      alert('인증 정보 불일치로 인하여 로그인 페이지로 이동합니다.');

      try {
        await signOutAction();
      } catch (error) {
        console.error('로그아웃 처리 중 오류:', error);
        // 실패해도 로그인 페이지로 이동
        router.push('/login');
      }
    };

    handleAuthMismatch();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
        <p className="text-gray-600">인증 정보를 확인하는 중...</p>
      </div>
    </div>
  );
}
