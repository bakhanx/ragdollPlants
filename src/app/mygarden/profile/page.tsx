import React from 'react';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import EditProfile from '@/app/mygarden/_components/EditProfile';
import { getCurrentUser } from '@/lib/auth-utils';

export default async function ProfileEditPage() {
  const session = await getCurrentUser();

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-03.webp" />
      <ContentsLayout>
        <Header
          title="프로필 수정"
          showBack
        />

        <div className="py-4">
          <EditProfile
            userInfo={{
              id: session.id,
              email: session.email || '',
              name: session.name || null,
            }}
          />
        </div>
      </ContentsLayout>
    </>
  );
}
