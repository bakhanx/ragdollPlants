'use server';

import bcryptjs from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signIn, signOut } from '@/auth';
import { signInSchema, signUpSchema } from '@/lib/validations/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

// 서버 사이드 응답 타입
type ActionResult = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

// 로그인 액션
export async function signInAction(formData: FormData) {
  try {
    // FormData를 객체로 변환
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string
    };

    // Zod 스키마로 검증
    const validationResult = signInSchema.safeParse(rawData);

    if (!validationResult.success) {
      const fieldErrors: Record<string, string[]> = {};

      validationResult.error.errors.forEach(error => {
        const field = error.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }
        fieldErrors[field].push(error.message);
      });

      return {
        success: false,
        message: '입력 정보를 확인해주세요',
        errors: fieldErrors
      };
    }

    const { email, password } = validationResult.data;

    // NextAuth signIn 호출
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      });
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return {
              success: false,
              message: '이메일 또는 비밀번호가 올바르지 않습니다',
              errors: { password: ['이메일 또는 비밀번호가 올바르지 않습니다'] }
            };
          default:
            return {
              success: false,
              message: '로그인에 실패했습니다',
              errors: { password: ['로그인에 실패했습니다'] }
            };
        }
      }
      throw error;
    }
  } catch (error) {
    console.error('로그인 에러:', error);

    return {
      success: false,
      message: '로그인 중 오류가 발생했습니다. 다시 시도해주세요.'
    };
  }

  // 성공 시 홈페이지로 리다이렉트
  redirect('/');
}

// 회원가입 액션
export async function signUpAction(formData: FormData): Promise<ActionResult> {
  try {
    // FormData를 객체로 변환
    const rawData = {
      loginId: formData.get('loginId') as string,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
      agreeToTerms: formData.get('agreeToTerms') === 'true'
    };

    // Zod 스키마로 검증
    const validationResult = signUpSchema.safeParse(rawData);

    if (!validationResult.success) {
      const fieldErrors: Record<string, string[]> = {};

      validationResult.error.errors.forEach(error => {
        const field = error.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }
        fieldErrors[field].push(error.message);
      });

      return {
        success: false,
        message: '입력 정보를 확인해주세요',
        errors: fieldErrors
      };
    }

    const { loginId, name, email, phone, password } = validationResult.data;

    // 이메일 중복 확인
    const existingEmailUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingEmailUser) {
      return {
        success: false,
        message: '이미 가입된 이메일입니다',
        errors: { email: ['이미 가입된 이메일입니다'] }
      };
    }

    // 로그인 ID 중복 확인
    const existingLoginIdUser = await prisma.user.findUnique({
      where: { loginId }
    });

    if (existingLoginIdUser) {
      return {
        success: false,
        message: '이미 사용중인 아이디입니다',
        errors: { loginId: ['이미 사용중인 아이디입니다'] }
      };
    }

    // 닉네임 중복 확인
    const existingNameUser = await prisma.user.findUnique({
      where: { name }
    });

    if (existingNameUser) {
      return {
        success: false,
        message: '이미 사용중인 닉네임입니다',
        errors: { name: ['이미 사용중인 닉네임입니다'] }
      };
    }

    // 비밀번호 해싱
    const hashedPassword = await bcryptjs.hash(password, 12);

    // 사용자 생성
    const newUser = await prisma.user.create({
      data: {
        loginId,
        name,
        email,
        password: hashedPassword,
        phone: phone || null // 빈 문자열이면 null로 저장
      }
    });
  } catch (error) {
    console.error('회원가입 에러:', error);

    return {
      success: false,
      message: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.'
    };
  }

  // 성공 시 로그인 페이지로 리다이렉트
  redirect('/login');
}

// 로그아웃 액션
export async function signOutAction() {
  await signOut({ redirectTo: '/login' });
}
