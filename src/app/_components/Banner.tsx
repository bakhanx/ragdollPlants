import Image from "next/image";
import React from "react";

export const Banner = () => {
  return (
    <div className="relative w-full max-w-md h-48 rounded-lg text-white p-4 flex flex-col justify-end">
      {/* 배경 이미지 */}
      <Image
        src="/images/welcome-bg-02.webp"
        alt="Create plans with Gardening App"
        fill
        style={{ objectFit: "cover" }}
        className="rounded-lg"
        priority
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-30 w-full h-full z-10 rounded-lg" />

      {/* 텍스트 내용 */}
      <div className="z-20">
        <p className="relative z-10 text-xs sm:text-sm">New in</p>
        <h2 className="relative z-10 text-lg sm:text-xl font-medium leading-snug">
          Create plans
          <br />
          with Gardening App
        </h2>
      </div>
    </div>
  );
};

export default Banner;
