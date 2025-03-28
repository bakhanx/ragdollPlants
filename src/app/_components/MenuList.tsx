import React from "react";
import Water from "@/../public/svg/water.svg";
import Plant from "@/../public/svg/plant.svg";
import Garden from "@/../public/svg/garden.svg";
import Link from "next/link";

const menuItems = [
  {
    label: "내 정원",
    icon: Garden,
    link: "/mygarden",
  },
  {
    label: "내 식물",
    icon: Plant,
    link: "/myplants",
  },
  {
    label: "물주기",
    icon: Water,
    link: "/water",
  },
  {
    label: "내 게시글",
    icon: Plant,
    link: "/",
  },
];

export const MenuList = () => {
  return (
    <div className="flex items-center gap-4 py-4 w-full">
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link href={`${item.link}`} key={item.label}>
            <div className="flex flex-col items-center gap-2 w-16">
              <div className="w-14 h-14 bg-[#73c06b] rounded-full shadow-lg flex items-center justify-center relative">
                {Icon && (
                  <div className="relative size-8 ">
                    <Icon
                      className="w-full h-full"
                      style={{ stroke: "white", }}
                    />
                  </div>
                )}
              </div>
              <p className="text-[#8ee984] text-xs font-semibold text-center">
                {item.label}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
