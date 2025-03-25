import Image from "next/image";
import React from "react";

type BackgroundImageProps = {
  src: string;
  overlay?: boolean;
  opacity?: number;
};

export const BackgroundImage = ({
  src,
  overlay = false,
  opacity = 0,
}: BackgroundImageProps) => {
  return (
    <div>
      {/* 배경 이미지 */}
      <div className="absolute inset-0 z-0">
        <Image alt="background" src={src} fill priority objectFit="cover" />
      </div>

      {/* 어두운 오버레이 */}
      {overlay && (
        <div className={`absolute inset-0 bg-black opacity-${opacity} z-0`} />
      )}
    </div>
  );
};

export default BackgroundImage;
