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
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full px-6 py-12 bg-[#f9f9f9]">
      {/* Contents */}
      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-md px-8 py-12 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg">
        {/* 헤더 */}
        <div className="flex items-center justify-between w-full max-w-[600px]">
          <p className="text-[28px] font-bold text-[#12121d]">
            <span className="text-[#12121d]">My </span>
            <span className="text-[#5b8e55]">Plants</span>
          </p>
          <img
            className="w-11 h-11 object-cover"  
            alt="Ellipse"
            src="https://c.animaapp.com/m8k13xvsWqaWls/img/ellipse-13.svg"
          />
        </div>

        {/* 식물 카드 부분 */}
        <div className="flex flex-wrap justify-center gap-5 w-full">
          {myPlants.map((plant, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-3 w-40 h-[230px] bg-[#ebebd2] rounded-[11px] relative p-4 backdrop-blur-md hover:scale-105 transition-all duration-300"
            >
              <img
                className="w-full h-[143px] object-cover rounded-[10px]"
                alt={plant.name}
                src={plant.imgSrc}
              />

              {/* 상태 아이콘 */}
              {plant.status && (
                <div className="absolute top-0 right-0 w-11 h-11 flex items-center justify-center bg-[#ff735d] rounded-full shadow-lg backdrop-blur-lg"> 
                  <img
                    className="w-4.5 h-4.5"
                    alt="Status Icon"
                    src="https://c.animaapp.com/m8k13xvsWqaWls/img/group-49.png"
                  />
                </div>
              )}

              {/* 식물 이름 */}
              <div className="text-center text-black font-medium text-lg mt-3">
                {plant.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
