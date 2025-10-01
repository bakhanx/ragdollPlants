import React from 'react';
import CountStatCard from './CountStatCard';

interface UserInfoSectionProps {
  nickname: string;
  level: number;
  levelTitle: string;
  stats: {
    diaries: number;
    galleries: number;
    careCount: number;
  };
}

export default function UserInfoSection({
  nickname,
  level,
  levelTitle,
  stats
}: UserInfoSectionProps) {
  return (
    <div className="min-w-0 flex-1">
      {/* 닉네임과 레벨 */}
      <div className="mb-3">
        <h2 className="truncate text-lg font-bold text-gray-800 sm:text-xl">
          {nickname}
        </h2>
        <div className="my-1 flex items-center gap-1">
          <span className="shrink-0 rounded-full bg-green-100 sm:px-[8px] px-[6px] sm:py-[2px] py-[1px] text-[11px] font-medium text-green-700 sm:text-xs">
            Lv. {level}
          </span>
          <span className="text-xs font-medium text-green-600 sm:text-sm">
            {levelTitle}
          </span>
        </div>
      </div>

      {/* 통계 그리드 */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <CountStatCard
          value={stats.diaries}
          label="다이어리"
          href="/diaries"
        />
        <CountStatCard
          value={stats.galleries}
          label="갤러리"
          href="/galleries"
        />
        <CountStatCard
          value={stats.careCount}
          label="관리횟수"
          href="/care"
        />
      </div>
    </div>
  );
}
