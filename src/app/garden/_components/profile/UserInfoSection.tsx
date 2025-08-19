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

export default function UserInfoSection({ nickname, level, levelTitle, stats }: UserInfoSectionProps) {
  return (
    <div className="min-w-0 flex-1">
      {/* 닉네임과 레벨 */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="truncate text-lg font-bold text-gray-800 sm:text-xl">
            {nickname}
          </h2>
          <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            Lv. {level}
          </span>
        </div>
        <p className="text-sm text-green-600 font-medium">
          {levelTitle}
        </p>
      </div>

      {/* 통계 그리드 */}
      <div className="grid grid-cols-3 gap-3">
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