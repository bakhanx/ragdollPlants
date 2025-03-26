import React from "react";
import { plantItems, profileImg } from "./_temp/constants";
import Image from "next/image";
import { MenuList } from "./_components/MenuList";
import ContentLayout from "./_components/ContentsLayout";
import BackgroundImage from "./_components/BackgroundImage";

export default function Page() {
  return (
    <>
      {/* 배경이미지 */}
      <BackgroundImage src="/images/welcome-bg-07.webp" overlay={true} />

      <ContentLayout>
        {/* 헤더 */}
        <div className="flex items-center justify-between w-full max-w-md">
          <p className="text-xl sm:text-2xl font-bold">
            <span className="text-[#12121d]">New on </span>
            <span className="text-[#5b8e55]">랙돌플랜츠</span>
          </p>
          <div className="w-10 h-10 sm:w-12 sm:h-12 relative">
            <Image
              src={profileImg}
              alt="Proifle"
              fill
              style={{ objectFit: "cover", borderRadius: "50%" }}
            />
          </div>
        </div>

        {/* 메뉴 리스트 */}
        <MenuList />

        {/* 배너 */}
        <div className="relative w-full max-w-md h-48 mt-8 rounded-lg text-white p-4 flex flex-col justify-end">
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
          <div className="absolute inset-0 bg-black opacity-30 w-full h-full z-10" />

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

        {/* 식물 리스트 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 w-full max-w-md">
          {plantItems.map((plant, index) => (
            <div key={index} className="relative">
              <div className="relative w-full h-40 sm:h-44 object-cover rounded-lg">
                <Image
                  fill
                  src={plant.image}
                  alt={plant.name || "New Plant"}
                  style={{ objectFit: "cover" }}
                />
              </div>
              {plant.isNew && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-[#60b357] text-white text-xs rounded-full">
                  New
                </div>
              )}
              {plant.name && (
                <p className="text-sm sm:text-base font-medium mt-2 text-center">
                  {plant.name}
                </p>
              )}
            </div>
          ))}
        </div>
      </ContentLayout>
    </>
  );
}
