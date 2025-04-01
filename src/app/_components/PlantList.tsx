import Image from "next/image";
import React from "react";

type PlantListProps = {
  items: {
    name: string;
    image: string;
    isNew: boolean;
  }[];
};

export const PlantList = ({ items }: PlantListProps) => {
  return (
    <div className="w-full">
      <div className="font-bold text-lg">Article</div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-md">
        {items.map((plant, index) => (
          <div key={index} className="relative">
            <div className="relative w-full aspect-square object-cover rounded-lg">
              <Image
                fill
                src={plant.image}
                alt={plant.name || "New Plant"}
                style={{ objectFit: "cover", borderRadius: "5%" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
