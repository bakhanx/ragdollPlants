import React from "react";

type ButtonProps = {
  text: string;
  type?: "normal" | "primary" | "outlined"; // 추가적인 버튼 타입 지원
};

function Button({ text, type = "normal" }: ButtonProps) {
  const baseStyle = "h-12 w-full text-lg rounded-lg transition";
  const primaryStyle = "bg-green-600 text-white hover:bg-green-700 border-none";
  const normalStyle =
    "bg-white text-green-600 hover:bg-gray-200 border-green-600 border";
  let buttonStyle = "";

  switch (type) {
    case "normal":
      buttonStyle = normalStyle;
      break;
    case "primary":
      buttonStyle = primaryStyle;
      break;

    default:
      buttonStyle = primaryStyle;
  }

  return <button className={`${baseStyle} ${buttonStyle}`}>{text}</button>;
}

export default Button;
