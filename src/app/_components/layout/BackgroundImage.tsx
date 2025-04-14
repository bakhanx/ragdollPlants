import Image from "next/image";
import React from "react";

type BackgroundImageProps = {
  src: string;
  overlay?: boolean;
};

export const BackgroundImage = ({
  src,
  overlay = false,
}: BackgroundImageProps) => {
  return (
    <div>
      {/* 배경 이미지 */}
      <div className="fixed inset-0 z-0">
        <Image
          alt="background"
          src={src}
          fill
          priority
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* 어두운 오버레이 */}
      {overlay && (
        <div className={`absolute inset-0 bg-black opacity-10 z-0`} />
      )}
    </div>
  );
};

export default BackgroundImage;
