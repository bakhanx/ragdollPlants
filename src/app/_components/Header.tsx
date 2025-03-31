import Image from "next/image";
import React from "react";
import { profileImg } from "../_temp/constants";

const Header = () => {
  return (
    <div className="flex items-center justify-between w-full max-w-md">
      <p className="text-xl sm:text-2xl font-bold">
        <span className="text-[#12121d]">New on </span>
        <span className="text-[#73c06b]">랙돌플랜츠</span>
      </p>
      <div className="w-10 h-10 sm:w-12 sm:h-12 relative">
        <Image
          src={profileImg}
          alt="Proifle"
          fill
          style={{ objectFit: "cover", borderRadius: "50%" }}
        />
      </div>
    </div>
  );
};

export default Header;
