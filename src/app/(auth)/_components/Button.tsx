import React from "react";

type ButtonProps = {
  text: string;
  buttonType?: "normal" | "primary" | "outlined"; // 추가적인 버튼 타입 지원
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ text, buttonType = "normal", disabled = false, className = "", type = "button", ...props }: ButtonProps) => {
  const baseStyle = "h-12 w-full text-lg rounded-lg transition";
  const primaryStyle = "bg-green-600 text-white hover:bg-green-700 border-none";
  const normalStyle =
    "bg-parent text-white hover:text-green-500 hover:border-green-600 border-white border-2";
  const disabledStyle = "opacity-50 cursor-not-allowed";
  
  let buttonStyle = "";

  switch (buttonType) {
    case "normal":
      buttonStyle = normalStyle;
      break;
    case "primary":
      buttonStyle = primaryStyle;
      break;
    default:
      buttonStyle = primaryStyle;
  }

  // disabled 상태일 때 hover 효과 제거
  const finalStyle = disabled 
    ? `${baseStyle} ${buttonStyle} ${disabledStyle}`.replace(/hover:[^ ]*/g, '')
    : `${baseStyle} ${buttonStyle}`;

  return (
    <button 
      className={`${finalStyle} ${className}`}
      disabled={disabled}
      type={type}
      {...props}
    >
      {text}
    </button>
  );
};
