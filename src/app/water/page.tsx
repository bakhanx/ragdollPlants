import React from "react";

type WaterCardProps = {
  backgroundColor: string;
  imageSrc: string;
  title: string;
  amount: number;
  statusIcon?: string;
};

const WaterCard = ({
  backgroundColor,
  imageSrc,
  title,
  amount,
  statusIcon,
}: WaterCardProps) => {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl w-full ${backgroundColor}`}
    >
      <img className="w-20 h-20 object-cover" alt="Plant" src={imageSrc} />
      <div className="flex flex-col">
        <p className="text-white font-medium">{title}</p>
        <div className="flex items-center gap-2 mt-2">
          <img
            className="w-3 h-3"
            alt="Vector"
            src="https://c.animaapp.com/m8k070m1mBEnyl/img/vector.svg"
          />
          <p className="text-white text-sm">{amount}ml</p>
        </div>
      </div>
      {statusIcon && (
        <div className="flex items-center justify-center w-12 h-12 bg-white/30 rounded-full backdrop-blur-sm">
          <img className="w-5 h-6" alt="Status Icon" src={statusIcon} />
        </div>
      )}
    </div>
  );
};

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
          imageSrc="https://c.animaapp.com/m8k070m1mBEnyl/img/57-572798-plants-png-2.png"
          statusIcon="https://c.animaapp.com/m8k070m1mBEnyl/img/group-49.png"
          title="Create with Gardening App"
          amount={150}
        />

        <WaterCard
          backgroundColor="bg-[#e6c2a0]"
          imageSrc="https://c.animaapp.com/m8k070m1mBEnyl/img/11232131312312-eke-1.png"
          statusIcon="https://c.animaapp.com/m8k070m1mBEnyl/img/group-49.png"
          title="Create with Gardening App"
          amount={150}
        />

        <WaterCard
          backgroundColor="bg-[#dfdfdf] border-2 border-red-400"
          imageSrc="https://c.animaapp.com/m8k070m1mBEnyl/img/artshare-ru-plants-28-1.png"
          title="Create with Gardening App"
          amount={150}
          statusIcon="https://c.animaapp.com/m8k070m1mBEnyl/img/group-49.png"
        />

        {/* 지난 날 카드 */}
        <div className="w-full">
          <p className="text-2xl font-medium text-black">Saturday, May 21</p>
          <WaterCard
            backgroundColor="bg-[#dfdfdf]"
            imageSrc="https://c.animaapp.com/m8k070m1mBEnyl/img/144-1444325-potted-plants-clipart-transparent-background-ikea-pl.png"
            title="Create with Gardening App"
            amount={150}
            statusIcon="https://c.animaapp.com/m8k070m1mBEnyl/img/group-50.png"
          />
        </div>
      </div>
    </div>
  );
}
