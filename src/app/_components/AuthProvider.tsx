'use client';

import { useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { getCurrentUserAction } from '@/app/actions/auth-client';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { setUser, initialize, isInitialized } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      // 이미 초기화되었으면 중복 실행 방지
      if (isInitialized) return;

      try {
        // 서버에서 현재 인증 상태 확인
        const result = await getCurrentUserAction();

        if (result.success) {
          setUser(result.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('인증 초기화 오류:', error);
        setUser(null);
      } finally {
        // 초기화 완료 표시
        initialize();
      }
    };

    initializeAuth();
  }, [setUser, initialize, isInitialized]);

  return <>{children}</>;
};
