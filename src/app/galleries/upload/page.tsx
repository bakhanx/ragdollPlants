import React from "react";
import { OptionCard } from "../_components/OptionCard";
import { PhotoUploadButton } from "../_components/PhotoUploadButton";
import Input from "../_components/Input";
import Header from "@/app/_components/layout/Header";
import ContentLayout from "@/app/_components/layout/ContentsLayout";
import AddButton from "../_components/AddButton";
import BackgroundImage from "@/app/_components/layout/BackgroundImage";

export default function Page() {
  return (
    <>
      <BackgroundImage src="/images/welcome-bg-05.webp"/>
      {/* Contents */}
      <ContentLayout>
        {/* 헤더 */}
        <Header />

        <PhotoUploadButton />

        {/* 입력 폼 */}
        <Input />

        {/* 카드 */}
        <OptionCard />

        {/* ADD 버튼 */}
        <AddButton />

      </ContentLayout>
    </>
  );
}
