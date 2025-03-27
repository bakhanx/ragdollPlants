"use client";

import React, { useState } from "react";

export const PasswordInput = ({ placeholder }: { placeholder: string }) => {
  const [isShown, setIsShown] = useState(false);

  return (
    <div className="relative">
      <input
        className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
        placeholder={placeholder}
        type={isShown ? "text" : "password"}
      />
      <button
        type="button"
        onClick={() => setIsShown((prev) => !prev)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-600 text-sm"
      >
        {isShown ? "Hide" : "Show"}
      </button>
    </div>
  );
};
