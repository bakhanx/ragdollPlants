import React from "react";
import BackgroundImage from "../../_components/BackgroundImage";
import Header from "../_components/Header";

import ContentLayout from "../../_components/ContentsLayout";
import Link from "next/link";
import { Button } from "../_components/Button";

export default function Page() {
  return (
    <>
      {/* 배경 이미지 */}
      <BackgroundImage src={"/images/welcome-bg-01.webp"} overlay={true} />

      {/* Contents */}
      <ContentLayout>
        {/* 헤더 */}
        <Header mainText="RagdollPlants" subText="랙돌플랜츠" />

        {/* Paragraph */}
        <div className="flex flex-col text-center mb-8 pt-8 gap-y-8">
          <h2 className="text-3xl   mb-2 flex flex-col text-white">
            <span>랙돌플랜츠에 오신 것을</span>
            <span>환영합니다!</span>
          </h2>
          <p className="text-base  leading-relaxed text-white">
            식물들과 함께 프레시함을 느껴요.
            <br />
            삶의 공간을 넓혀보세요!
          </p>
        </div>

        {/* 버튼 */}
        <div className="flex flex-col gap-4 w-full">
          <Link href="/login">
            <Button text="로그인" type="primary" />
          </Link>
          <Button text="Login With Google" />
          <Link href="/signup">
            <Button text="회원가입" />
          </Link>
        </div>
      </ContentLayout>
    </>
  );
}
