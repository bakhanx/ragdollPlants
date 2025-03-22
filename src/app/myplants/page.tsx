import React from "react";

const myPlants = [
  {
    imgSrc:
      "https://c.animaapp.com/m8k13xvsWqaWls/img/arecaceae-plant-leaf-palm-branch-potted-green-plants-91540cccf1e.png",
    name: "Cactus Red",
    status: true, // 상태를 나타내는 값 (물 부족 여부)
  },
  {
    imgSrc:
      "https://c.animaapp.com/m8k13xvsWqaWls/img/11232131312312-eke-1.png",
    name: "Cactus Red",
    status: false,
  },
  {
    imgSrc:
      "https://c.animaapp.com/m8k13xvsWqaWls/img/artshare-ru-plants-28-1.png",
    name: "Cactus Red",
    status: true,
  },
  {
    imgSrc:
      "https://c.animaapp.com/m8k13xvsWqaWls/img/57-572798-plants-png-1.png",
    name: "Cactus Red",
    status: false,
  },
  {
    imgSrc: "https://c.animaapp.com/m8k13xvsWqaWls/img/r-1.png",
    name: "Cactus Red",
    status: true,
  },
  {
    imgSrc:
      "https://c.animaapp.com/m8k13xvsWqaWls/img/144-1444325-potted-plants-clipart-transparent-background-ikea-pl.png",
    name: "Cactus Red",
    status: false,
  },
];

export default function Page() {
  return (
    <div className="flex flex-col items-center gap-6 px-[19px] py-[35px] bg-[#f9f9f9] w-full min-w-[430px] max-w-md mx-auto h-screen">
      <div className="w-full  flex flex-col items-center gap-6">
        {/* 상단 제목과 이미지 */}
        <div className="flex items-center justify-between w-full max-w-[600px]">
          <p className="text-[28px] font-bold text-[#12121d] leading-8">
            <span className="text-[#12121d]">My </span>
            <span className="text-[#5b8e55]">Plants</span>
          </p>

          <img
            className="w-[44.46px] h-[44.46px] object-cover"
            alt="Ellipse"
            src="https://c.animaapp.com/m8k13xvsWqaWls/img/ellipse-13.svg"
          />
        </div>

        {/* 식물 카드 부분 */}
        <div className="flex flex-wrap justify-center gap-[20px] w-full">
          {myPlants.map((plant, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-3 w-[168px] h-[230px] bg-[#ebebd2] rounded-[11px] relative p-[15px]"
            >
              <img
                className="w-full h-[143px] object-cover rounded-[10px]"
                alt={plant.name}
                src={plant.imgSrc}
              />

              {/* 상태 아이콘 */}
              {plant.status && (
                <div className="absolute top-0 right-0 w-[43px] h-[43px] flex items-center justify-center bg-[#ff735d] rounded-full shadow-lg backdrop-blur-lg">
                  <img
                    className="w-[18px] h-[18px]"
                    alt="Status Icon"
                    src="https://c.animaapp.com/m8k13xvsWqaWls/img/group-49.png" // 상태 아이콘 이미지
                  />
                </div>
              )}

              {/* 식물 이름 */}
              <div className="text-center text-black font-medium text-lg tracking-[0] leading-[26px] mt-3">
                {plant.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
