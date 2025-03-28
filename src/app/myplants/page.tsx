import React from "react";

import BackgroundImage from "../_components/BackgroundImage";
import ContentLayout from "../_components/ContentsLayout";
import Header from "../_components/Header";
import PlantCard from "./_components/PlantCard";
import FloatingButton from "./_components/FloatingButton";

export default function Page() {
  return (
    <>
      <BackgroundImage src="/images/welcome-bg-06.webp" />
      {/* Contents */}
      <ContentLayout>
        {/* 헤더 */}
        <Header />

        {/* 식물 카드 부분 */}
        <PlantCard />
        

        {/* Floating Button */}
        <FloatingButton/>

      </ContentLayout>
    </>
  );
}
