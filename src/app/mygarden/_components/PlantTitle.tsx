import React from "react";

export const PlantTitles = [
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
  "초보",
];

interface PlantTitleProps {
  interests?: string[];
}

const PlantTitle: React.FC<PlantTitleProps> = ({ interests = [] }) => {
  // 표시할 관심사가 없으면 후반부 카테고리를 기본값으로 사용
  const titlesToShow = interests.length > 0 ? interests : PlantTitles.slice(20);
  
  return (
    <div className="flex flex-wrap gap-x-[5px] gap-y-1 text-[10px] w-full">
      {titlesToShow.map((title) => (
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
