import Image from "next/image";
import React from "react";
import PlantTitle from "../mygarden/_components/PlantTitle";

type UserProfileProps = {
  nickname: string;
  level: number;
  stats: {
    followers: number;
    visitors: number;
    plants: number;
  };
  levelProgress?: number;
  todayWaterCount?: number;
  nutrientCount?: number;
};

export default function UserProfile({
  nickname,
  level,
  stats,
  levelProgress,
  todayWaterCount,
  nutrientCount,
}: UserProfileProps) {
  return (
    <section className="w-full max-w-2xl mx-auto space-y-6">
      {/* 프로필 카드 */}
      <div className="relative p-5 rounded-2xl overflow-hidden">
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/80 to-white/60 backdrop-blur-sm" />

        {/* 메인 콘텐츠 */}
        <div className="relative flex gap-5">
          {/* 프로필 이미지 */}
          <div className="shrink-0">
            <div className="relative size-20 sm:size-24 rounded-2xl overflow-hidden border-2 border-green-200 shadow-lg">
              <Image
                src="/images/Profile.png"
                alt={nickname}
                fill
                sizes="(max-width: 768px) 80px, 96px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* 유저 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                {nickname}
              </h2>
              <span className="shrink-0 px-2 py-0.5 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                Lv. {level}
              </span>
            </div>

            {/* 통계 그리드 */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center py-2 px-1.5 rounded-xl bg-white/50 border border-green-100 hover:bg-white/70 transition-colors">
                <span className="text-base sm:text-lg font-bold text-green-700 leading-none mb-1">
                  {stats.followers}
                </span>
                <span className="text-xs text-gray-600 whitespace-nowrap">
                  팔로워
                </span>
              </div>
              <div className="flex flex-col items-center py-2 px-1.5 rounded-xl bg-white/50 border border-green-100 hover:bg-white/70 transition-colors">
                <span className="text-base sm:text-lg font-bold text-green-700 leading-none mb-1">
                  {stats.visitors}
                </span>
                <span className="text-xs text-gray-600 whitespace-nowrap">
                  방문자
                </span>
              </div>
              <div className="flex flex-col items-center py-2 px-1.5 rounded-xl bg-white/50 border border-green-100 hover:bg-white/70 transition-colors">
                <span className="text-base sm:text-lg font-bold text-green-700 leading-none mb-1">
                  {stats.plants}
                </span>
                <span className="text-xs text-gray-600 whitespace-nowrap">
                  보유식물
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 진행도 바 */}
        <div className="relative mt-5">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs sm:text-sm text-gray-600">
              다음 레벨까지
            </span>
            <span className="text-xs sm:text-sm font-medium text-green-700">
              {levelProgress}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
        </div>
      </div>

      <PlantTitle />

      {/* 식물 관리 상태 요약 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="relative p-4 rounded-xl bg-white/50 border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-4 h-4 text-blue-500 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 4a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2V4z"
              />
            </svg>
            <span className="font-medium text-sm text-gray-700 truncate">
              물 주기
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">
            오늘 물 줄 식물{" "}
            <span className="font-bold text-blue-600">{todayWaterCount}</span>개
          </p>
        </div>
        <div className="relative p-4 rounded-xl bg-white/50 border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-4 h-4 text-yellow-500 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span className="font-medium text-sm text-gray-700 truncate">
              영양 관리
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">
            이번 주 관리 필요{" "}
            <span className="font-bold text-yellow-600">{nutrientCount}</span>개
          </p>
        </div>
      </div>
    </section>
  );
}
