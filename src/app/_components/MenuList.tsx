import React from "react";
import Water from "@/../public/svg/water.svg";
import Plant from "@/../public/svg/plant.svg";
import Link from "next/link";

const menuItems = [
  {
    label: "내 정원",
    icon: Plant,
    link: "/mygarden",
  },
  {
    label: "내 식물",
    icon: Plant,
    link: "/myplants",
  },
  {
    label: "내 앨범",
    icon: Plant,
    link: "/",
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
              <div className="w-14 h-14 bg-[#5b8e55] rounded-full shadow-lg flex items-center justify-center relative">
                {Icon && (
                  <div className="relative size-8 ">
                    <Icon
                      className="w-full h-full"
                      style={{ stroke: "#ff0000" }}
                    />
                  </div>
                )}
              </div>
              <p className="text-[#5b8e55] text-xs font-semibold text-center">
                {item.label}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
