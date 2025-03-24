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
      <div className="relative z-10 flex flex-col justify-center items-center w-full max-w-md px-8 py-12 bg-white/10 backdrop-blur-xl rounded-lg shadow-lg min-h-[70vh]">
        {/* 로고 */}
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-3xl font-semibold text-[#24570b]">
            RagdollPlants
          </h1>
        </div>

        {/* 로그인 메시지 */}
        <div className="flex flex-col text-center mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            랙돌 <span className="text-green-600">플랜츠</span>
          </h2>
          <p className="text-sm tracking-wide text-gray-700">
            로그인 해주세요. 식물들이 기다리고 있어요~
          </p>
        </div>

        {/* 입력 필드*/}
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <input
            className="w-full p-4 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Email"
            type="email"
          />
          <div className="relative">
            <input
              className="w-full p-4 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Password"
              type="password"
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-600 text-sm font-medium">
              Show
            </button>
          </div>

          {/*비밀번호 찾기 */}
          <div className="flex justify-between items-center text-sm text-gray-600">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 border-gray-300" />{" "}
              Remember Me
            </label>
            <button className="text-green-600">Forgot Password?</button>
          </div>

          {/* 로그인 버튼 */}
          <button className="h-12 w-full text-lg font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition">
            LOGIN
          </button>

          {/* 회원가입 링크 */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{" "}
            <a href="#" className="text-green-600 underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
