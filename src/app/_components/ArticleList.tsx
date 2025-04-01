import Image from "next/image";
import React from "react";

type PlantListProps = {
  items: {
    name: string;
    image: string;
    isNew: boolean;
  }[];
};

export const ArticleList = ({ items }: PlantListProps) => {
  return (
    <div className="w-full py-6">
      <div className="font-bold text-lg">Article</div>

      <div className="gap-4 flex flex-col w-full max-w-md">
        {items.map((plant, index) => (
          <div
            key={index}
            className="relative flex gap-x-2 bg-[#ffffffa5] rounded-md shadow-xl border-green-600 border-2"
          >
            <div className="relative size-24 shrink-0 object-cover rounded-lg flex">
              <Image
                fill
                src={plant.image}
                alt={plant.name || "New Plant"}
                style={{ objectFit: "cover", borderRadius: "5%" }}
              />
            </div>
            <div className="flex flex-col">
              <h2 className="font-semibold">{plant.name}</h2>
              <p className="text-sm text-gray-600">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Molestias expedita et amet consectetur
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
