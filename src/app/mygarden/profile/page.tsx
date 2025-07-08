import React from 'react';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import EditProfile from '@/app/mygarden/_components/EditProfile';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function ProfileEditPage() {
  // 서버에서 세션 확인
  const session = await auth();

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-06.webp" />
      <ContentsLayout>
        <Header
          title="프로필 수정"
          showBack
        />

        <div className="py-4">
          <EditProfile
            userId={session.user.id}
          />
        </div>
      </ContentsLayout>
    </>
  );
}
