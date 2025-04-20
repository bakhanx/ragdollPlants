'use client';

import { useState, useEffect } from 'react';

interface AuthState {
  isAdmin: boolean;
  isLoggedIn: boolean;
  userId: string | null;
}

// 임시 인증 상태 (나중에 실제 인증 시스템으로 교체 예정)
export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    isAdmin: false,
    isLoggedIn: false,
    userId: null
  });

  useEffect(() => {
    // 여기서 localStorage나 쿠키 등에서 사용자 인증 정보를 가져올 수 있음
    // 임시 구현: localStorage에서 인증 상태를 확인
    try {
      const storedAuth = localStorage.getItem('authState');
      if (storedAuth) {
        setAuthState(JSON.parse(storedAuth));
      }
    } catch (error) {
      console.error('인증 상태를 불러오는 중 오류 발생:', error);
    }
  }, []);

  return authState;
} 