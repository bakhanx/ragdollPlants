import React from "react";
import BackgroundImage from "../../_components/BackgroundImage";
import ContentLayout from "../../_components/ContentsLayout";
import { PasswordInput } from "../_components/PasswordInput";
import { Input } from "../_components/Input";
import Header from "../_components/Header";
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

        {/* 로그인 메시지 */}
        <div className="flex flex-col text-center mb-8 pt-8 text-white">
          <p className="text-sm tracking-wide ">
            로그인 해주세요. 식물들이 기다리고 있어요~
          </p>
        </div>

        {/* 입력 필드*/}
        <div className="flex flex-col gap-4 w-full ">
          <Input placeholder="아이디 (이메일)" type="email" />
          <PasswordInput placeholder="비밀번호" />

          {/*비밀번호 찾기 */}
          <div className="flex justify-between items-center text-sm text-gray-100">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 border-gray-300" />{" "}
              아이디 기억하기
            </label>
            <button className="text-green-500">비밀번호 찾기</button>
          </div>

          {/* 로그인 버튼 */}
          <div className="flex flex-col gap-4 w-full ">
            <Button text="로그인하기" type="primary" />
            <Button text="Login With Google" type="normal" />
          </div>

          {/* 회원가입 링크 */}
          <p className="text-center text-sm text-gray-100 mt-4">
            계정이 없으신가요?{" "}
            <Link href="signup" className="text-green-500 underline">
              회원가입
            </Link>
          </p>
        </div>
      </ContentLayout>
    </>
  );
}
