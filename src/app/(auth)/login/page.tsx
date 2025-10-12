'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import BackgroundImage from '../../_components/layout/BackgroundImage';
import { ContentsLayout } from '../../_components/layout/ContentsLayout';
import { PasswordInput } from '../_components/PasswordInput';
import { Input } from '../_components/Input';
import Header from '../_components/Header';
import Link from 'next/link';
import { Button } from '../_components/Button';
import { signInSchema, type SignInData } from '@/lib/validations/auth';
import { signInAction } from '@/app/actions/auth';
import { getCurrentUserAction } from '@/app/actions/auth-client';
import { useAuthStore } from '@/stores/authStore';
import { signIn } from 'next-auth/react';
import { GoogleIcon, NaverIcon } from '../../_components/icons';

export default function Page() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState<string>('');
  const [rememberMe, setRememberMe] = useState(false);
  const { setUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur'
  });

  const onSubmit = async (data: SignInData) => {
    setIsSubmitting(true);
    setServerMessage('');

    try {
      // FormData 생성
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);

      // 서버 액션 호출
      const result = await signInAction(formData);

      if (result.success) {
        try {
          const userResult = await getCurrentUserAction();
          if (userResult.success) {
            setUser(userResult.user);
          }
        } catch (error) {
          console.error('로그인 후 사용자 정보 로드 오류:', error);
        }

        setServerMessage(result.message || '로그인이 완료되었습니다.');
        router.push('/');
      } else {
        setServerMessage(result.message || '로그인에 실패했습니다.');

        // 서버에서 반환된 필드별 에러 처리
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            setError(field as keyof SignInData, {
              type: 'server',
              message: messages[0]
            });
          });
        }
      }
    } catch (error) {
      console.error('로그인 요청 중 오류:', error);
      setServerMessage('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* 배경 이미지 */}
      <BackgroundImage src={'/images/welcome-bg-01.webp'} />

      {/* Contents */}
      <ContentsLayout showFooter={false}>
        {/* 헤더 */}
        <Header
          mainText="RagdollPlants"
          subText="랙돌플랜츠"
        />

        {/* 로그인 메시지 */}
        <div className="mb-8 flex flex-col pt-8 text-center text-white">
          <p className="text-sm tracking-wide">
            로그인 해주세요. 식물들이 기다리고 있어요~
          </p>
        </div>

        {/* 서버 메시지 표시 */}
        {serverMessage && (
          <div
            className={`mb-6 rounded-lg p-4 text-center ${
              serverMessage.includes('성공') || serverMessage.includes('완료')
                ? 'border border-green-300 bg-green-100 text-green-800'
                : 'border border-red-300 bg-red-100 text-red-800'
            }`}>
            {serverMessage}
          </div>
        )}

        {/* 로그인 폼 */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4">
          <Input
            {...register('email')}
            placeholder="이메일"
            type="email"
            error={errors.email?.message}
          />
          <PasswordInput
            {...register('password')}
            placeholder="비밀번호"
            error={errors.password?.message}
            showStrengthMeter={false}
          />

          {/* 아이디 기억하기 & 비밀번호 찾기 */}
          <div className="flex items-center justify-between text-sm text-gray-100">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 border-gray-300"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
              />
              아이디 기억하기
            </label>
            <Link
              href="/forgot-password"
              className="text-green-500 hover:underline">
              비밀번호 찾기
            </Link>
          </div>

          {/* 로그인 버튼 */}
          <div className="flex w-full flex-col gap-4">
            <Button
              text={isSubmitting ? '로그인 중...' : '로그인하기'}
              buttonType="primary"
              disabled={isSubmitting}
              type="submit"
            />
            {/* 소셜 로그인 구분선 */}
            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              
            </div>

            {/* 구글 로그인 버튼 */}
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl: '/' })}
              disabled={isSubmitting}
              className="relative flex w-full items-center rounded-lg border-2 border-white bg-white px-4 py-3 text-gray-700 shadow-sm transition-colors hover:border-green-600 hover:bg-gray-200 disabled:opacity-50" >
              <GoogleIcon
                size={20}
                className="absolute left-4"
              />
              <span className="flex-1 text-center text-sm font-medium">
                구글 계정으로 로그인
              </span>
            </button>

            {/* 네이버 로그인 버튼 (준비중) */}
            <button
              type="button"
              onClick={() => {
                // TODO: 네이버 로그인 구현 예정
              }}
              disabled={true}
              className="relative flex w-full cursor-not-allowed items-center rounded-lg bg-green-600 px-4 py-3 text-gray-100 opacity-50 shadow-sm">
              <NaverIcon
                size={20}
                className="absolute left-4"
              />
              <span className="flex-1 text-center text-sm font-medium">
                네이버 계정으로 로그인 (준비중)
              </span>
            </button>

            {/* 게스트 로그인 버튼 */}
            <Button
              text="게스트로 둘러보기"
              buttonType="normal"
              onClick={() => router.push('/')}
            />
          </div>

          {/* 회원가입 링크 */}
          <p className="mt-4 text-center text-sm text-gray-100">
            계정이 없으신가요?{' '}
            <Link
              href="/signup"
              className="text-green-500 underline hover:no-underline">
              회원가입
            </Link>
          </p>
        </form>
      </ContentsLayout>
    </>
  );
}
