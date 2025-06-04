'use server';

import { z } from 'zod';
import bcryptjs from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signUpSchema } from '@/lib/validations/auth';
import { redirect } from 'next/navigation';

// 서버 사이드 응답 타입
type ActionResult = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function signUpAction(formData: FormData): Promise<ActionResult> {
  try {
    // FormData를 객체로 변환
    const rawData = {
      username: formData.get('username') as string,
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

    const { username, name, email, phone, password } = validationResult.data;

    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return {
        success: false,
        message: '이미 가입된 이메일입니다',
        errors: { email: ['이미 가입된 이메일입니다'] }
      };
    }

    // 비밀번호 해싱
    const hashedPassword = await bcryptjs.hash(password, 12);

    // 사용자 생성
    const newUser = await prisma.user.create({
      data: {
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
