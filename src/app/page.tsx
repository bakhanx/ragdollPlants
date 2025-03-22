import React from "react";

const menuItems = [
  { label: "My Garden", icon: "https://c.animaapp.com/m8jzi9r4995GJI/img/group-49.png" },
  { label: "My Plants", icon: "" }, // 아이콘이 빠져있던 부분
];

const plantItems = [
  { name: "Cactus", image: "https://c.animaapp.com/m8jzi9r4995GJI/img/rectangle-10.svg", isNew: true },
  { name: "Cactus Red", image: "https://c.animaapp.com/m8jzi9r4995GJI/img/rectangle-12.svg", isNew: false },
  { name: "Unknown Plant", image: "https://c.animaapp.com/m8jzi9r4995GJI/img/rectangle-16.svg", isNew: false },
  { name: "", image: "https://c.animaapp.com/m8jzi9r4995GJI/img/frame-72.png", isNew: true },
];

export default function Page() {
  return (
    <div className="flex flex-col items-center px-6 py-4 bg-[#f9f9f9] min-h-screen">
      {/* 헤더 */}
      <div className="flex items-center justify-between w-full max-w-md">
        <p className="text-xl sm:text-2xl font-bold">
          <span className="text-[#12121d]">New on </span>
          <span className="text-[#5b8e55]">Plantio</span>
        </p>
        <img className="w-10 h-10 sm:w-12 sm:h-12" src="https://c.animaapp.com/m8jzi9r4995GJI/img/ellipse-13.svg" alt="Profile" />
      </div>

      {/* 메뉴 리스트 */}
      <div className="flex items-center gap-6 mt-6">
        {menuItems.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-14 h-14 bg-[#5b8e55] rounded-full shadow-lg flex items-center justify-center relative">
              {item.icon && <img className="w-5 h-5" src={item.icon} alt={item.label} />}
            </div>
            <p className="text-[#5b8e55] text-sm sm:text-base font-medium text-center">{item.label}</p>
          </div>
        ))}
      </div>

      {/* 배너 */}
      <div className="relative w-full max-w-md h-48 mt-8 rounded-lg text-white p-4 flex flex-col justify-end bg-cover bg-center"
        style={{ backgroundImage: "url(https://c.animaapp.com/m8jzi9r4995GJI/img/frame-68.png)" }}>
        <p className="text-xs sm:text-sm">New in</p>
        <h2 className="text-lg sm:text-xl font-medium leading-snug">
          Create plans
          <br />
          with Gardening App
        </h2>
      </div>

      {/* 식물 리스트 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 w-full max-w-md">
        {plantItems.map((plant, index) => (
          <div key={index} className="relative">
            <img className="w-full h-40 sm:h-44 object-cover rounded-lg" src={plant.image} alt={plant.name || "New Plant"} />
            {plant.isNew && (
              <div className="absolute top-2 right-2 px-2 py-1 bg-[#60b357] text-white text-xs rounded-full">
                New
              </div>
            )}
            {plant.name && <p className="text-sm sm:text-base font-medium mt-2 text-center">{plant.name}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
