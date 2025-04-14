import Link from "next/link";
import React from "react";

export const FloatingButton = () => {
  return (
    <button className="fixed bottom-10 right-8 bg-green-600 text-white rounded-full size-16 flex justify-center items-center text-4xl z-50 hover:bg-green-700">
      <Link href="/myplants/upload">+</Link>
    </button>
  );
};

export default FloatingButton;
