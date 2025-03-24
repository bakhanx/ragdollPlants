import React from "react";

export default function Page() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-transparent to-[#152b0a] text-[#24570b]">
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://c.animaapp.com/m8jyupbtBv3Vrq/img/-welcome.png)",
        }}
      />

      {/* Contents */}
      <div className="relative z-10 flex flex-col justify-center items-center w-full max-w-md px-6 py-10 bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg min-h-[70vh]">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-[#24570b] text-4xl font-semibold">
            RagdollPlants
          </h1>
        </div>

        {/* Paragraph */}
        <div className="flex flex-col text-center mb-8 pt-8 gap-y-8">
          <h2 className="text-3xl font-medium text-[#24570b] mb-2 flex flex-col">
            <span>랙돌플랜츠에 오신 것을</span>
            <span>환영합니다!</span>
          </h2>
          <p className="text-base text-[#24570b] leading-relaxed">
            식물들과 함께 프레시함을 느껴요.
            <br />
            삶의 공간을 넓혀보세요!
          </p>
        </div>

        {/* 버튼 */}
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button className="h-12 w-full text-lg font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition">
            로그인
          </button>
          <button className="h-12 w-full text-lg font-medium bg-white border-green-600 border text-green-600 rounded-lg hover:bg-[#f4f4f4] transition">
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
