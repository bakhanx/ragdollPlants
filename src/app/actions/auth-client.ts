'use server';

import { getCurrentUser } from '@/lib/auth-utils';
import type { AuthUser } from '@/stores/authStore';

/**
 * 클라이언트에서 호출 가능한 현재 사용자 정보 조회 서버 액션
 */
export async function getCurrentUserAction(): Promise<{
  success: boolean;
  user: AuthUser | null;
}> {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        success: true,
        user: null
      };
    }
    
    // AuthUser 타입에 맞게 변환
    const authUser: AuthUser = {
      id: user.id,
      loginId: user.loginId,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role
    };
    
    return {
      success: true,
      user: authUser
    };
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    return {
      success: false,
      user: null
    };
  }
}
