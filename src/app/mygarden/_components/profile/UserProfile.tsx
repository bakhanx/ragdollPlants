import React from 'react';
import { WaterIcon, NutrientIcon } from '@/app/_components/icons';
import Card from '@/app/_components/common/Card';
import ProfileImage from './ProfileImage';
import CountStatCard from './CountStatCard';
import LevelProgress from './LevelProgress';
import CareStatusCard from './CareStatusCard';
import PlantTitle from '../PlantTitle';
import Link from 'next/link';

type UserProfileProps = {
  nickname: string;
  level: number;
  stats: {
    galleries: number;
    visitors: number;
    plants: number;
  };
  levelProgress?: number;
  todayWaterCount?: number;
  nutrientCount?: number;
  interests?: string[];
};

export default function UserProfile({
  nickname,
  level,
  stats,
  levelProgress = 0,
  todayWaterCount = 0,
  nutrientCount = 0,
  interests = []
}: UserProfileProps) {
  return (
    <section className="mx-auto w-full max-w-2xl space-y-6 py-4">
      {/* 프로필 카드 */}
      <Card
        className="p-5"
        isHover={false}>
        <div className="relative flex gap-5">
          <Link
            href="/mygarden/profile"
            className="hover:opacity-80">
            <ProfileImage
              src="/images/Profile.png"
              alt={nickname}
              showEditHint={true}
            />
          </Link>

          {/* 유저 정보 */}
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-center gap-2">
              <h2 className="truncate text-lg font-bold text-gray-800 sm:text-xl">
                {nickname}
              </h2>
              <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                Lv. {level}
              </span>
            </div>

            {/* 통계 그리드 */}
            <div className="grid grid-cols-3 gap-3">
              <CountStatCard
                value={stats.visitors}
                label="다이어리"
                href="/diary"
              />
              <CountStatCard
                value={stats.galleries}
                label="갤러리"
                href="/gallery"
              />
              <CountStatCard
                value={stats.plants}
                label="물준횟수"
                href="/water"
              />
            </div>
          </div>
        </div>

        <LevelProgress progress={levelProgress} />
        
        {/* 관심사 태그 */}
        <div className="mt-4">
          <PlantTitle interests={interests} />
        </div>
      </Card>

      {/* 식물 관리 상태 요약 */}
      <div className="grid grid-cols-2 gap-3">
        <CareStatusCard
          icon={<WaterIcon />}
          iconColor="[&_path]:stroke-blue-600"
          title="물 주기"
          count={todayWaterCount}
          href="/water"
          textColor="text-blue-600"
        />
        <CareStatusCard
          icon={<NutrientIcon />}
          iconColor="[&_path]:stroke-yellow-600"
          title="영양 관리"
          count={nutrientCount}
          href="/nutrients"
          textColor="text-yellow-600"
        />
      </div>
    </section>
  );
}
