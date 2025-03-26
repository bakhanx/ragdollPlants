import React from "react";
import Water from "@/../public/svg/water.svg";
import Plant from "@/../public/svg/plant.svg";

const menuItems = [
  {
    label: "My Garden",
    icon: Water,
  },
  {
    label: "My Plants",
    icon: Plant,
  },
  {
    label: "Example",
    icon: Plant,
  },
  {
    label: "Example2",
    icon: Plant,
  },
];

export const MenuList = () => {
  return (
    <div className="flex items-center gap-6 mt-6 w-full">
      {menuItems.map((item, index) => (
        <div key={index} className="flex flex-col items-center gap-2 w-20">
          <div className="w-14 h-14 bg-[#5b8e55] rounded-full shadow-lg flex items-center justify-center relative">
            {item.icon && (
              <div className="relative size-8 ">
                <item.icon
                  className="w-full h-full"
                  style={{ stroke: "#ff0000" }}
                />
              </div>
            )}
          </div>
          <p className="text-[#5b8e55] text-xs font-medium text-center">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
};
