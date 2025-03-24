import React from "react";

export default function Page() {
  return (
    <div className="relative flex items-center justify-center min-h-screen w-full px-6 py-12 bg-[#f9f9f9]">
      {/* Contents */}
      <div className="relative z-10 flex flex-col gap-6 w-full max-w-md px-8 py-12 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg">
        
        {/* 헤더 */}
        <div className="flex justify-between items-center w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#12121d]">
            My <span className="text-[#5b8e55]">Garden</span>
          </h1>
          <img
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
            alt="Profile"
            src="https://c.animaapp.com/m8jzqjrxFYxxY8/img/ellipse-13.svg"
          />
        </div>

        {/* 아이콘 섹션 */}
        <div className="flex justify-between sm:justify-start sm:gap-6 w-full">
          {["Water", "Light", "Plants"].map((item) => (
            <div key={item} className="flex flex-col items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-all duration-300 backdrop-blur-md">
                <img
                  className="w-6 sm:w-8 sm:h-8"
                  alt={item}
                  src={`https://c.animaapp.com/m8jzqjrxFYxxY8/img/group-49.png`}
                />
              </div>
              <span className="text-[#5b8e55] text-sm sm:text-base mt-1">{item}</span>
            </div>
          ))}
        </div>

        {/* 내 식물 목록 */}
        <div>
          <h2 className="text-xl sm:text-2xl font-medium text-[#394434]">My Plants</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 w-full">
            {["Cactus Red", "Cactus Green"].map((plant) => (
              <div key={plant} className="flex flex-col items-center">
                <img
                  className="w-full h-40 sm:h-44 object-cover rounded-md hover:scale-105 transition-all duration-300 backdrop-blur-md"
                  alt={plant}
                  src={`https://c.animaapp.com/m8jzqjrxFYxxY8/img/rectangle-12.svg`}
                />
                <span className="text-lg sm:text-xl font-medium mt-2">{plant}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 식물 상태 */}
        {["Cactus Red", "Cactus Green"].map((plant) => (
          <div key={plant} className="w-full bg-white p-4 rounded-lg shadow-md flex items-center gap-4 backdrop-blur-md hover:scale-105 transition-all duration-300">
            <img
              className="w-24 sm:w-28 h-20 sm:h-24 object-cover rounded-md"
              alt={plant}
              src="https://c.animaapp.com/m8jzqjrxFYxxY8/img/rectangle-14.svg"
            />
            <div>
              <h3 className="text-lg sm:text-xl font-medium">{plant}</h3>
              <p className="text-sm sm:text-base text-gray-500">Create an Aepod</p>
              <p className="text-sm sm:text-base text-[#61b458]">Water Level</p>
              <div className="w-full bg-gray-200 h-1 rounded-full mt-1">
                <div className="bg-[#60b357] h-1 rounded-full w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
