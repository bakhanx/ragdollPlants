import React from 'react';
import BackgroundImage from '../_components/BackgroundImage';
import ContentLayout from '../_components/ContentsLayout';
import Header from '../_components/Header';
import { MenuList } from '../_components/MenuList';
import { PlantList } from '../_components/PlantList';
import PlantTitle from './_components/PlantTitle';
import UserProfile from '../_components/UserProfile';
import { plantItems, userProfileData } from '../_temp/constants';

export default function Page() {
  const userData = userProfileData;
  return (
    <>
      <BackgroundImage src="/images/welcome-bg-06.webp" />
      <ContentLayout>
        <Header
          showBackButton
          title="나의 프로필"
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
