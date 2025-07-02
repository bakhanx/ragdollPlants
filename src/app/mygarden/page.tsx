import React from 'react';
import BackgroundImage from '../_components/layout/BackgroundImage';
import { ContentsLayout } from '../_components/layout/ContentsLayout';
import { Header } from '../_components/header/Header';
import { MenuList } from '../_components/lists/MenuList';
import UserProfile from './_components/profile/UserProfile';
import Link from 'next/link';
import { EditIcon } from '../_components/icons';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getUserProfileData } from '../actions/userProfile';
import LogoutButton from './_components/LogoutButton';

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  const user = await getUserProfileData(session.user.id);
  if (!user) {
    redirect('/login');
  }

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-06.webp" />
      <ContentsLayout>
        <Header
          title={`${user.name || '사용자'}님의 정원`}
          showNotification
        />

        <div className="relative mb-4">
          <UserProfile
            nickname={user.name || '사용자'}
            level={user.level}
            stats={{
              galleries: user._count.galleries,
              visitors: user._count.followersList,
              plants: user._count.plants
            }}
            levelProgress={user.levelProgress}
            todayWaterCount={user.todayWaterCount}
            todayNutrientCount={user.todayNutrientCount}
            interests={user.interests}
            profileImage={session.user.image}
          />

          {/* 프로필 편집 버튼과 로그아웃 버튼 */}
          <div className="absolute top-7 right-5 flex gap-2">
            <Link
              href="/mygarden/profile"
              className="rounded-full bg-white/80 p-2 shadow-sm transition-colors hover:bg-white/100"
              aria-label="프로필 편집">
              <EditIcon
                size={20}
                className="text-gray-600"
              />
            </Link>
            
            <LogoutButton />
          </div>
        </div>

        <MenuList />
      </ContentsLayout>
    </>
  );
}
