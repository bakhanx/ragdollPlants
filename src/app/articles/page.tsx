import React from 'react';
import BackgroundImage from '../_components/layout/BackgroundImage';
import ContentLayout from '../_components/layout/ContentsLayout';
import Header from '../_components/layout/Header';

const Page = () => {
  const handleNotificationClick = () => {
    // 알림 클릭 처리
    console.log('알림 클릭됨');
  };

  return (
    <>
      <BackgroundImage
        src="/images/welcome-bg-07.webp"
        overlay={true}
      />
      <ContentLayout>
        <Header
          showBackButton={true}
          title="식물 기사"
          variant="glass"
          showNotification={true}
          
        />
        {/* 나머지 컴포넌트들 */}
      </ContentLayout>
    </>
  );
};

export default Page;
