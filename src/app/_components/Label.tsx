import React from "react";

export const Label = ({ text }: { text: string }) => {
  return (
    <div className="absolute top-2 right-2 px-2 py-1 bg-[#60b357] text-white text-xs rounded-full">
      {text}
    </div>
  );
};
