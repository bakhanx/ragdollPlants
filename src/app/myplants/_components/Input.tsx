import React from "react";

const formInputs = [
  "식물 이름 (ex: 몬스테라)",
  "종류 (ex: 관엽)",
  "위치 (ex: 거실)"
];

const InputCard = ({ placeholder }: { placeholder: string }) => (
  <input
    type="text"
    placeholder={placeholder}
    className="w-full p-2 border border-[#60b357] rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#60b357]"
  />
);

const Input = () => {
  return (
    <div className="flex flex-wrap w-full max-w-full items-end gap-6 py-4">
      {formInputs.map((input, index) => (
        <InputCard key={index} placeholder={input} />
      ))}
    </div>
  );
};

export default Input;
