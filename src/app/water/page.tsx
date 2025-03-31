import React from "react";
import { WaterCard } from "./_components/WaterCard";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 bg-[#f9f9f9]">
      <div className="flex flex-col w-full max-w-md items-start gap-10 px-6 py-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg">
        {/* 헤더 */}
        <div className="flex items-center justify-between w-full">
          <p className="text-3xl font-bold text-[#12121d]">
            <span>Water </span>
            <span className="text-green-600">Plants</span>
          </p>
        </div>

        {/* 카드 */}
        <WaterCard
          backgroundColor="bg-[#e6bdbb]"
          imageSrc=""
          statusIcon=""
          title="Create with Gardening App"
          amount={150}
        />

        <WaterCard
          backgroundColor="bg-[#e6c2a0]"
          imageSrc=""
          statusIcon=""
          title="Create with Gardening App"
          amount={150}
        />

        <WaterCard
          backgroundColor="bg-[#dfdfdf]"
          imageSrc=""
          title="Create with Gardening App"
          amount={150}
          statusIcon=""
        />

        {/* 지난 날 카드 */}
        <div className="w-full">
          <p className="text-2xl font-medium text-black">Saturday, May 21</p>
          <WaterCard
            backgroundColor="bg-[#dfdfdf]"
            imageSrc=""
            title="Create with Gardening App"
            amount={150}
            statusIcon=""
          />
        </div>
      </div>
    </div>
  );
}
