import React from "react";
import BackgroundImage from "../_components/BackgroundImage";

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
        <div className="flex items-center gap-3 mb-6 flex-col">
          <h1 className="text-4xl font-semibold text-green-600">
            RagdollPlants
          </h1>
          <h3 className="text-white text-lg">랙돌플랜츠</h3>
        </div>

        {/* 로그인 메시지 */}
        <div className="flex flex-col text-center mb-8 pt-8 text-white">
          <p className="text-sm tracking-wide ">
            로그인 해주세요. 식물들이 기다리고 있어요~
          </p>
        </div>

        {/* 입력 필드*/}
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <input
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Email"
            type="email"
          />
          <div className="relative">
            <input
              className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Password"
              type="password"
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-600 text-sm ">
              Show
            </button>
          </div>

          {/*비밀번호 찾기 */}
          <div className="flex justify-between items-center text-sm text-gray-300">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 border-gray-300" />{" "}
              Remember Me
            </label>
            <button className="text-green-500">Forgot Password?</button>
          </div>

          {/* 로그인 버튼 */}
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <button className="h-12 w-full text-lg  text-white bg-green-600 rounded-lg hover:bg-green-700 transition">
              로그인하기
            </button>
            <button className="h-12 w-full text-lg   bg-white rounded-lg hover:bg-gray-200 transition">
              Login With Google
            </button>
          </div>

          {/* 회원가입 링크 */}
          <p className="text-center text-sm text-gray-300 mt-4">
            계정이 없으신가요?{" "}
            <a href="#" className="text-green-500 underline">
              회원가입
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
