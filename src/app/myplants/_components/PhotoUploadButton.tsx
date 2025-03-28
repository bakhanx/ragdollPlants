import React from "react";

export const PhotoUploadButton = () => {
  return (
    <div className="relative my-4">
      {/* label로 감싸서 클릭 시 input 트리거 */}
      <label
        htmlFor="photo-upload"
        className="size-32 bg-[#f8faf8] rounded-[14px] border border-[#60b357] flex justify-center items-center transition-all duration-300 hover:bg-[#f1f5f1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#60b357] relative cursor-pointer"
        aria-label="사진 업로드"
      >
        {/* + 아이콘 */}
        <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-[#60b357] rounded-full flex justify-center items-center">
          <span className="text-white text-3xl font-bold">+</span>
        </div>
      </label>

      {/* input 요소는 화면에서 숨김 */}
      <input
        id="photo-upload"
        type="file"
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};
