import React from "react";

const AddButton = () => {
  return (
    <button
      className="flex w-1/2 items-center justify-center text-white py-3 my-4 bg-[#5b8e55] rounded-md transition-all duration-300 hover:bg-[#4a7645] focus:ring-2 focus:ring-offset-2 focus:ring-[#5b8e55] active:bg-[#3a5833]"
      aria-label="등록하기 버튼"
    >
      등록하기
    </button>
  );
};

export default AddButton;
