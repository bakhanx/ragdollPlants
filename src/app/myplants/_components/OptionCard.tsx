"use client";

import React from "react";

import Water from "@/../public/svg/water2.svg";
import Sun from "@/../public/svg/sun.svg";
import Nutrients from "@/../public/svg/vape-kit.svg";

const cards = [
  {
    title: "물 주기",
    description: "일",
    icon: Water,
    isActive: true,
  },
  {
    title: "빛 주기",
    description: "시간",
    icon: Sun,
    isActive: false,
  },
  {
    title: "비료 주기",
    description: "일",
    icon: Nutrients,
    isActive: true,
  },
];

type ActiveCardProps = {
  title: string;
  description: string;
  Icon: React.ElementType;
  isActive: boolean;
  onToggle: (isActive: boolean) => void;
};

const ActiveCard = ({
  title,
  description,
  Icon,
  isActive,
  onToggle,
}: ActiveCardProps) => (
  <div className="relative w-full bg-white rounded-lg shadow-sm">
    <div className="flex items-center gap-4 relative p-3">
      {/* 아이콘 */}
      <div className="flex size-13 shrink-0 items-center justify-center bg-[#5b8e55] rounded-lg">
        <div className="relative size-6">
          <Icon className="w-full h-full" />
        </div>
      </div>

      <div className="flex justify-between items-center w-full">
        {/* 텍스트 */}
        <div className="flex flex-col justify-between h-13 ">
          <div className="">{title}</div>
          <div className="flex items-center gap-x-1 text-sm text-gray-500">
            <input
              type="number"
              className="w-8 h-5 px-1 border-[#5b8e55] border-2 rounded-sm appearance-none text-center"
              defaultValue={1}
              min={1}
              max={31}
            />
            <span className="text-red-600"> {description}</span>
          </div>
        </div>

        {/* 토글버튼 */}
        <label
          className={`cursor-pointer flex items-center p-1 rounded-full w-10 h-6 ${isActive ? "bg-[#60b357]" : "bg-[#ddd]"}`}
        >
          <input
            type="checkbox"
            checked={isActive}
            onChange={() => onToggle(!isActive)}
            className="hidden"
          />
          <div
            className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-in-out ${
              isActive ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </label>
      </div>
    </div>
  </div>
);

export const OptionCard = () => {
  const [cardsState, setCardsState] = React.useState(
    cards.map((card) => card.isActive)
  );

  const handleToggle = (index: number, value: boolean) => {
    const updatedCards = [...cardsState];
    updatedCards[index] = value;
    setCardsState(updatedCards);
  };

  return (
    <div className="flex flex-col w-full items-center gap-4 py-4">
      {cards.map((card, index) => (
        <ActiveCard
          key={index}
          title={card.title}
          description={card.description}
          Icon={card.icon}
          isActive={cardsState[index]}
          onToggle={(value) => handleToggle(index, value)}
        />
      ))}
    </div>
  );
};
