import Image from "next/image";
import Water from "@/../public/svg/water.svg";
import Water2 from "@/../public/svg/water2.svg";

type WaterCardProps = {
  backgroundColor: string;
  imageSrc: string;
  title: string;
  amount: number;
  statusIcon?: string;
};

export const WaterCard = ({
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
      <div className="relative size-20">
        <Image src={imageSrc} alt={title} fill style={{ objectFit: "cover" }} />
      </div>

      <div className="flex flex-col">
        <p className="text-white font-medium">{title}</p>
        <div className="flex items-center gap-2 mt-2">
          <Water className="size-3" />

          <p className="text-white text-sm">{amount}ml</p>
        </div>
      </div>
      {true && (
        <div className="flex items-center justify-center w-12 h-12 bg-white/30 rounded-full backdrop-blur-sm">
          <Water2 className="size-5" />
        </div>
      )}
    </div>
  );
};
