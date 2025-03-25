import React from "react";
import BackgroundImage from "../_components/BackgroundImage";
import Header from "../_components/Header";
import Button from "../_components/Button";

export default function Page() {
  return (
    <div className="relative flex min-h-screen items-center justify-center ">
      {/* 배경 이미지 */}
      <BackgroundImage
        src={"/images/welcome-bg-01.webp"}
        overlay={true}
        opacity={20}
      />

      {/* Contents */}
      <div className="relative z-10 flex flex-col justify-center items-center w-full max-w-md px-6 py-10 bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg min-h-[80vh]">
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
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <Button text="로그인" type="primary" />
          <Button text="Login With Google" />
          <Button text="회원가입" />
        </div>
      </div>
    </div>
  );
}
