import React from 'react';
import BackgroundImage from '../_components/layout/BackgroundImage';
import { ContentsLayout } from '../_components/layout/ContentsLayout';
import { Header } from '../_components/header/Header';
import { MenuList } from '../_components/lists/MenuList';
import UserProfile from './_components/profile/UserProfile';
import { userProfileData } from '../_temp/userData';
import Link from 'next/link';
import { EditIcon } from '../_components/icons';

export default function Page() {
  // 0번째 인덱스의 사용자 데이터 사용
  const user = userProfileData[0];

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-06.webp" />
      <ContentsLayout>
        <Header
          title={`${user.name}님의 정원`}
          showNotification
        />

        <div className="relative mb-4">
          <UserProfile
            nickname={user.name}
            level={user.level}
            stats={{
              galleries: user.posts,
              visitors: user.followers,
              plants: user.following
            }}
            levelProgress={user.levelProgress}
            todayWaterCount={user.plantCare.waterCount}
            nutrientCount={user.plantCare.nutrientCount}
            interests={user.interests}
          />

          {/* 프로필 편집 버튼 */}
          <Link
            href="/mygarden/profile"
            className="absolute top-7 right-5 rounded-full bg-white/80 p-2 shadow-sm transition-colors hover:bg-white/100"
            aria-label="프로필 편집">
            <EditIcon
              size={20}
              className="text-gray-600"
            />
          </Link>
        </div>

        <MenuList />
      </ContentsLayout>
    </>
  );
}
