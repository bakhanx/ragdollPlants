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

export default function Page() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState<string>('');
  const [rememberMe, setRememberMe] = useState(false);

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
        // 성공 시 클라이언트에서 리다이렉트
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
            <Button
              text="Login With Google"
              buttonType="normal"
              onClick={() => {
                // Google 로그인 로직 추가 예정
                console.log('Google 로그인');
              }}
            />

            {/* 임시 Admin 로그인 버튼 */}
            <Button
              text="Admin 로그인 (임시)"
              buttonType="normal"
              onClick={async e => {
                e.preventDefault();
                setIsSubmitting(true);
                setServerMessage('');

                try {
                  const formData = new FormData();
                  formData.append('email', 'ragdollplants@gamil.com');
                  formData.append('password', 'admin7777');

                  const result = await signInAction(formData);

                  if (result.success) {
                    setServerMessage(result.message || 'Admin 로그인이 완료되었습니다.');
                    router.push('/');
                  } else {
                    setServerMessage(
                      result.message || 'Admin 로그인에 실패했습니다.'
                    );
                  }
                } catch (error) {
                  console.error('Admin 로그인 중 오류:', error);
                  setServerMessage('Admin 로그인 중 오류가 발생했습니다.');
                } finally {
                  setIsSubmitting(false);
                }
              }}
              disabled={isSubmitting}
            />
            
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
