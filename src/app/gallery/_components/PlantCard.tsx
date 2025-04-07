import { myPlants } from "@/app/_temp/constants";
import Image from "next/image";
import React from "react";
import Water from "@/../public/svg/water2.svg";

const PlantCard = () => {
  return (
    <div className="grid grid-cols-3 justify-center gap-5 w-full h-full py-4">
        {/* inext 고칠것 */}
      {myPlants.map((plant, index) => (
        <div
          key={index}
          className="w-full aspect-square rounded-md relative hover:scale-105 transition-all duration-300 "
        >
          <Image
            className="rounded-md"
            fill
            alt={plant.name}
            src={plant.image}
            style={{ objectFit: "cover" }}
          />

          {/* 상태 아이콘 */}
          {plant.status && (
            <div className="absolute -top-2 -right-2 size-8 flex items-center justify-center bg-[#ff735d] rounded-full shadow-lg">
              <Water className="p-2 w-full h-full" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PlantCard;
