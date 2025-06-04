'use server';

import { z } from "zod";
import { signIn } from "@/auth";
import { signInSchema } from "@/lib/validations/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

// 서버 사이드 응답 타입
type ActionResult = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function signInAction(formData: FormData) {
  try {
    // FormData를 객체로 변환
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    // Zod 스키마로 검증
    const validationResult = signInSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      const fieldErrors: Record<string, string[]> = {};
      
      validationResult.error.errors.forEach((error) => {
        const field = error.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }
        fieldErrors[field].push(error.message);
      });

      return {
        success: false,
        message: "입력 정보를 확인해주세요",
        errors: fieldErrors
      };
    }

    const { email, password } = validationResult.data;

    // NextAuth signIn 호출
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return {
              success: false,
              message: "이메일 또는 비밀번호가 올바르지 않습니다",
              errors: { password: ["이메일 또는 비밀번호가 올바르지 않습니다"] }
            };
          default:
            return {
              success: false,
              message: "로그인에 실패했습니다",
              errors: { password: ["로그인에 실패했습니다"] }
            };
        }
      }
      throw error;
    }

  } catch (error) {
    console.error('로그인 에러:', error);
    
    return {
      success: false,
      message: "로그인 중 오류가 발생했습니다. 다시 시도해주세요."
    };
  }

  // 성공 시 홈페이지로 리다이렉트
  redirect('/');
} 