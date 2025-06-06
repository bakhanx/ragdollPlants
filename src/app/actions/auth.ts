'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// 회원가입 유효성 검사 스키마
const registerSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다'),
  name: z.string().optional(),
});

// 회원가입 Server Action
export async function registerUser(formData: FormData) {
  try {
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      name: formData.get('name') as string,
    };

    // 입력 검증
    const validationResult = registerSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => err.message).join(', ');
      throw new Error(errors);
    }

    const { email, password, name } = validationResult.data;

    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('이미 사용 중인 이메일입니다.');
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 12);

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        emailVerified: new Date(), // 이메일 인증을 바로 완료로 설정
      },
    });

    console.log('회원가입 완료:', { id: user.id, email: user.email });

    // 성공 시 로그인 페이지로 리다이렉트
    redirect('/login?message=회원가입이 완료되었습니다');
  } catch (error) {
    console.error('회원가입 에러:', error);
    throw error;
  }
} 