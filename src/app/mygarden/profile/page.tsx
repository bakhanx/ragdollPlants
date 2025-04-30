'use client';

import React from 'react';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import EditProfile from '@/app/mygarden/_components/EditProfile';
import { useRouter } from 'next/navigation';
import { userProfileData } from '@/app/_temp/userData';

export default function ProfileEditPage() {
  const router = useRouter();

  // 현재는 첫번째 유저를 고정적으로 사용 (로그인 기능 구현 시 실제 로그인한 유저 사용)
  const currentUserId = userProfileData[0].id;

  // 취소 시 마이가든 페이지로 이동
  const handleCancel = () => {
    router.push('/mygarden');
  };

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-06.webp" />
      <ContentsLayout>
        <Header
          title="프로필 수정"
          onBackClick={handleCancel}
        />

        <div className="py-4">
          <EditProfile
            userId={currentUserId}
            onCancel={handleCancel}
          />
        </div>
      </ContentsLayout>
    </>
  );
}
