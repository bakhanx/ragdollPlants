import React from 'react';
import BackgroundImage from '../_components/layout/BackgroundImage';
import ContentLayout from '../_components/layout/ContentsLayout';
import Header from '../_components/layout/Header';
import { MenuList } from '../_components/lists/MenuList';
import UserProfile from './_components/profile/UserProfile';
import { userProfileData } from '../_temp/constants';

export default function Page() {
  const userData = userProfileData;
  return (
    <>
      <BackgroundImage src="/images/welcome-bg-06.webp" />
      <ContentLayout>
        <Header
          title="초록이님의 정원"
          showNotification
        />

        <UserProfile
          nickname={userData.nickname}
          level={userData.level}
          stats={userData.stats}
          levelProgress={userData.levelProgress}
          todayWaterCount={userData.plantCare.waterCount}
          nutrientCount={userData.plantCare.nutrientCount}
        />

        <MenuList />
      </ContentLayout>
    </>
  );
}
