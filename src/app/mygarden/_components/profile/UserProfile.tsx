import React from 'react';
import ProfileCard from './ProfileCard';
import CareStatusSection from './CareStatusSection';
import { UserProfileProps } from '@/types/components/mygarden';

export default function UserProfile({
  nickname,
  level,
  stats,
  levelProgress = 0,
  todayWaterCount = 0,
  todayNutrientCount = 0,
  interests = [],
  profileImage
}: UserProfileProps & { profileImage?: string | null }) {
  return (
    <section className="mx-auto w-full max-w-2xl space-y-6 py-4">
      {/* 프로필 카드 */}
      <ProfileCard
        nickname={nickname}
        level={level}
        stats={stats}
        levelProgress={levelProgress}
        interests={interests}
        profileImage={profileImage}
      />

      {/* 식물 관리 상태 요약 */}
      <CareStatusSection
        todayWaterCount={todayWaterCount}
        todayNutrientCount={todayNutrientCount}
      />
    </section>
  );
}
