import React from "react";
import BackgroundImage from "../_components/BackgroundImage";
import ContentLayout from "../_components/ContentsLayout";
import Header from "../_components/Header";
import { MenuList } from "../_components/MenuList";
import PlantList from "../_components/PlantList";
import { plantItems } from "../_temp/constants";
import PlantTitle from "./_components/PlantTitle";

export default function Page() {
  return (
    <>
      <BackgroundImage src="/images/welcome-bg-06.webp" />

      {/* Contents */}
      <ContentLayout>
        {/* 헤더 */}
        <Header />

        {/* 메뉴 리스트 */}
        <MenuList />

        {/* 칭호 */}
        <PlantTitle />

        {/* 내 식물 목록 (대표사진)*/}
        <PlantList items={plantItems} />

        {/* 유저 데이터 */}
        <section className="w-full py-2 my-2 rounded-md relative">
          <div className="absolute inset-0 bg-white opacity-30 rounded-md" />

          <div className="relative text-sm px-2">
            <div>팔로워 : 27</div>
            <div>방문자 수 : 12</div>
            <div>보유 식물수 : 30</div>
          </div>
          <div></div>
        </section>

        {/* 유저 데이터 */}
        <section className="w-full py-2 my-2 rounded-md relative">
          <div className="absolute inset-0 bg-white opacity-30 rounded-md" />

          <div className="relative text-sm px-2">
            <div>팔로워 : 27</div>
            <div>방문자 수 : 12</div>
            <div>보유 식물수 : 30</div>
          </div>
          <div></div>
        </section>
        
        {/* 유저 데이터 */}
        <section className="w-full py-2 my-2 rounded-md relative">
          <div className="absolute inset-0 bg-white opacity-30 rounded-md" />

          <div className="relative text-sm px-2">
            <div>팔로워 : 27</div>
            <div>방문자 수 : 12</div>
            <div>보유 식물수 : 30</div>
          </div>
          <div></div>
        </section>

        {/* 식물 상태 */}
        {/* {["Cactus Red", "Cactus Green"].map((plant) => (
          <div
            key={plant}
            className="w-full bg-white p-4 rounded-lg shadow-md flex items-center gap-4 backdrop-blur-md hover:scale-105 transition-all duration-300"
          >
            <img
              className="w-24 sm:w-28 h-20 sm:h-24 object-cover rounded-md"
              alt={plant}
              src="https://c.animaapp.com/m8jzqjrxFYxxY8/img/rectangle-14.svg"
            />
            <div>
              <h3 className="text-lg sm:text-xl font-medium">{plant}</h3>
              <p className="text-sm sm:text-base text-gray-500">
                Create an Aepod
              </p>
              <p className="text-sm sm:text-base text-[#61b458]">Water Level</p>
              <div className="w-full bg-gray-200 h-1 rounded-full mt-1">
                <div className="bg-[#60b357] h-1 rounded-full w-1/4"></div>
              </div>
            </div>
          </div>
        ))} */}
      </ContentLayout>
    </>
  );
}
