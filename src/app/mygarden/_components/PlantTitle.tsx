import React from "react";

const Titles = [
  "관엽",
  "침엽수",
  "다육",
  "야생화",
  "수경",
  "열대",
  "허브",
  "착생",
  "화초",
  "관화",
  "양치",
  "과일나무",
  "약용",
  "정원",
  "덩굴",
  "분재",
  "꽃나무",
  "공기정화",
  "동양란",
  "서양란",
  "묘목",
  "모종",
  "씨앗",
  "수생",
  "행잉",
  "테라리움",
  "비바리움",
  "팔루다리움",
  "이끼",
  "식충",
  "채소",
  "곡물",
  "리톱스",
];

const PlantTitle = () => {
  const mTitles = Titles.slice(20);
  return (
    <div className="flex flex-wrap gap-x-[5px] gap-y-1 text-[10px] w-full py-2">
      {mTitles.map((title) => (
        <div
          className="text-white bg-[#3082ce] rounded-sm p-1 shadow-lg"
          key={title}
        >
          {title}
        </div>
      ))}
    </div>
  );
};

export default PlantTitle;
