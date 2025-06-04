import { z } from "zod";

// 회원가입 폼 검증 스키마
export const signUpSchema = z.object({
  username: z
    .string()
    .min(2, "아이디는 최소 2글자 이상이어야 합니다")
    .max(20, "아이디는 최대 20글자까지 가능합니다")
    .regex(/^[a-zA-Z0-9_]+$/, "아이디는 영문, 숫자, 언더스코어(_)만 사용 가능합니다"),
  
  name: z
    .string()
    .min(2, "이름은 최소 2글자 이상이어야 합니다")
    .max(10, "이름은 최대 10글자까지 가능합니다"),
  
  email: z
    .string()
    .email("올바른 이메일 형식을 입력해주세요")
    .min(1, "이메일을 입력해주세요"),
  
  phone: z
    .string()
    .regex(/^010-\d{4}-\d{4}$/, "올바른 연락처 형식을 입력해주세요 (010-0000-0000)")
    .optional()
    .or(z.literal("")),
  
  password: z
    .string()
    .min(6, "비밀번호는 최소 6글자 이상이어야 합니다")
    .max(50, "비밀번호는 최대 50글자까지 가능합니다"),
  
  confirmPassword: z
    .string()
    .min(1, "비밀번호 확인을 입력해주세요"),
  
  agreeToTerms: z
    .boolean()
    .refine(val => val === true, "이용약관에 동의해주세요")
}).refine(data => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["confirmPassword"]
});

// 로그인 폼 검증 스키마
export const signInSchema = z.object({
  email: z
    .string()
    .email("올바른 이메일 형식을 입력해주세요")
    .min(1, "이메일을 입력해주세요"),
  
  password: z
    .string()
    .min(1, "비밀번호를 입력해주세요")
});

// 타입 추출
export type SignUpData = z.infer<typeof signUpSchema>;
export type SignInData = z.infer<typeof signInSchema>; 