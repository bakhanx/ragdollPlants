import React from "react";
import { plantItems } from "./_temp/constants";
import ContentLayout from "./_components/ContentsLayout";
import BackgroundImage from "./_components/BackgroundImage";
import Banner from "./_components/Banner";
import { MenuList } from "./_components/MenuList";
import Header from "./_components/Header";
import { ArticleList } from "./_components/ArticleList";

export default function Page() {
  return (
    <>
      {/* 배경이미지 */}
      <BackgroundImage src="/images/welcome-bg-07.webp" overlay={true} />

      <ContentLayout>
        
        {/* 헤더 */}
        <Header/>

        {/* 메뉴 리스트 */}
        <MenuList />

        {/* 배너 */}
        <Banner />

        {/* 기사 리스트 */}
        <ArticleList items={plantItems} />
      </ContentLayout>
    </>
  );
}
