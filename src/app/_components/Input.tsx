import React from "react";

type InputProps = {
  placeholder: string;
  type: "text" | "email" | "phone" | "range" | (string & {});
};

export const Input = ({ placeholder, type = "text" }: InputProps) => {
  return (
    <input
      className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
      placeholder={placeholder}
      type={type}
    />
  );
};
