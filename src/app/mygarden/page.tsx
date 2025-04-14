import React from 'react';
import BackgroundImage from '../_components/layout/BackgroundImage';
import ContentLayout from '../_components/layout/ContentsLayout';
import Header from '../_components/layout/Header';
import { MenuList } from '../_components/lists/MenuList';
import UserProfile from './_components/profile/UserProfile';
import { userProfileData } from '../_temp/userData';

export default function Page() {
  // 0번째 인덱스의 사용자 데이터 사용
  const user = userProfileData[0];
  
  return (
    <>
      <BackgroundImage src="/images/welcome-bg-06.webp" />
      <ContentLayout>
        <Header
          title={`${user.name}님의 정원`}
          showNotification
        />

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
        />

        <MenuList />
      </ContentLayout>
    </>
  );
}
