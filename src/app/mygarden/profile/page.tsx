'use client';

import React from 'react';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import EditProfile from '@/app/mygarden/_components/EditProfile';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function ProfileEditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 취소 시 마이가든 페이지로 이동
  const handleCancel = () => {
    router.push('/mygarden');
  };

  // 로딩 중
  if (status === 'loading') {
    return (
      <>
        <BackgroundImage src="/images/welcome-bg-06.webp" />
        <ContentsLayout>
          <Header
            title="프로필 수정"
            showBack
            onBackClick={handleCancel}
          />
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
              <p className="text-gray-600">로딩 중...</p>
            </div>
          </div>
        </ContentsLayout>
      </>
    );
  }

  // 인증되지 않음
  if (!session?.user) {
    router.push('/login');
    return null;
  }

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-06.webp" />
      <ContentsLayout>
        <Header
          title="프로필 수정"
          showBack
          onBackClick={handleCancel}
        />

        <div className="py-4">
          <EditProfile
            userId={session.user.id}
            onCancel={handleCancel}
          />
        </div>
      </ContentsLayout>
    </>
  );
}
