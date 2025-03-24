import React from "react";

type InfoCardProps = {
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
};

const InfoCard = ({ title, description, icon, isActive }: InfoCardProps) => (
  <div className="relative w-full max-w-full h-full py-2 bg-white rounded-lg shadow-ds">
    <div className="inline-flex items-center gap-6 relative">
      <div className="flex w-16 h-16 items-center justify-center gap-2.5 px-6 py-4 bg-[#5b8e55] rounded-lg">
        <img className="w-6 h-6" alt="icon" src={icon} />
      </div>

      <div className="flex flex-col w-40 items-start gap-1">
        <div className="font-medium text-label-black100 text-lg">{title}</div>
        <div className="text-[#888888] text-sm">{description}</div>
      </div>
      {/* 토글버튼 */}
      <button
        className={`flex items-center gap-1.5 p-1 rounded-full w-10 h-6 ${isActive ? "bg-[#60b357]" : " bg-[#ddd]"}`}
      >
        <div
          className={`w-4.5 h-4.5 bg-[#fff] rounded-full transition-transform duration-300 ease-in-out ${
            isActive ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  </div>
);

const InputCard = ({ label }: { label: string }) => (
  <div className="flex w-full max-w-full h-12 items-center gap-2.5 px-4 py-4 bg-white rounded-lg border border-solid border-[#60b357]">
    <div className="flex-1 text-[#969c96] text-base">{label}</div>
  </div>
);

export default function Page() {
  const cards = [
    {
      title: "Watering",
      description: "Thrice In A Week",
      icon: "https://c.animaapp.com/m8k0avscLldRQ5/img/group-49.png",
      isActive: true,
    },
    {
      title: "Sunlight",
      description: "Daily",
      icon: "https://c.animaapp.com/m8k0avscLldRQ5/img/vuesax-linear-sun.svg",
      isActive: false,
    },
    {
      title: "Nutrients",
      description: "Thrice In A Week",
      icon: "https://c.animaapp.com/m8k0avscLldRQ5/img/group-26917.png",
      isActive: true,
    },
  ];

  const formInputs = ["Name Of The Plant", "Add Type", "Add Location"];

  return (
    <div className="relative flex flex-col h-full items-center justify-center gap-10 px-6 py-8 bg-[#f9f9f9] max-w-md mx-auto">
      {/* Contents */}
      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-md px-8 py-12 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg">
        {/* 헤더 */}
        <div className="flex w-full items-center justify-between">
          <p className="font-bold text-[#12121d] text-2xl leading-7 whitespace-nowrap">
            Water <span className="font-bold text-[#5b8e55]">Plants</span>
          </p>
        </div>

        {/* 사진등록*/}
        <div className="relative w-[137px] h-[125px] bg-[#f8faf8] rounded-[14px] border border-[#60b357]">
          <button className="absolute -bottom-4 -right-4 w-10 h-10 bg-[#60b357] rounded-full flex justify-center items-center">
            <span className="text-white text-3xl font-bold">+</span>
          </button>
        </div>

        {/* 입력 폼 */}
        <div className="flex flex-wrap w-full max-w-full items-end gap-6">
          {formInputs.map((input, index) => (
            <InputCard key={index} label={input} />
          ))}
        </div>

        {/* 카드 */}
        <div className="flex flex-col w-full items-center gap-6">
          {cards.map((card, index) => (
            <InfoCard
              key={index}
              title={card.title}
              description={card.description}
              icon={card.icon}
              isActive={card.isActive}
            />
          ))}
        </div>

        {/* ADD 버튼 */}
        <div className="flex w-full items-center justify-center gap-2.5 py-3 bg-[#5b8e55] rounded-full">
          <div className="font-medium text-white text-xl">ADD</div>
        </div>
      </div>
    </div>
  );
}
