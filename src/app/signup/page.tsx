import React from "react";

export default function Page() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full px-6 py-12 bg-white">
      {/* Contents */}
      <div className="relative z-10 flex flex-col items-start gap-6 w-full max-w-md px-8 py-12 bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg">
        {/* 헤더 */}
        <h1 className="text-3xl font-semibold text-[#24570b]">
          RagdollPlants
        </h1>
        <h2 className="text-xl font-semibold text-gray-900">
          회원가입 on <span className="text-green-600">랙돌플랜츠</span>
        </h2>
        <p className="text-gray-600 text-sm">
          계정을 생성하세요. 식물들이 기다리고 있어요!
        </p>

        {/* 입력 폼 */}
        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <input
          type="text"
          placeholder="Phone"
          className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <input
          type="password"
          placeholder="Repeat Password"
          className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
        />

        {/* 이용 약관 */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-600"
          />
          <span className="text-sm text-gray-600">
            I Agree to the terms and conditions
          </span>
        </div>

        {/* 버튼 */}
        <button className="w-full py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition font-medium">
          회원가입
        </button>
      </div>
    </div>
  );
}
