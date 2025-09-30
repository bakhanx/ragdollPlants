import React from 'react';
import ProfileCard from './ProfileCard';
import CareStatusSection from './CareStatusSection';
import { UserProfileData } from '@/app/actions/userProfile';

interface UserProfileComponentProps {
  user: UserProfileData;
  isOwner: boolean;
}

export default function UserProfile({
  user,
  isOwner
}: UserProfileComponentProps) {
  return (
    <section className="mx-auto w-full max-w-2xl space-y-6 py-4">
      {/* 프로필 카드 */}
      <ProfileCard
        nickname={user.name || '사용자'}
        loginId={user.loginId}
        bio={user.bio}
        level={user.level}
        levelTitle={user.levelTitle}
        stats={{
          diaries: user._count.diaries,
          galleries: user._count.galleries,
          careCount: user.waterCount + user.nutrientCount // 누적 관리횟수
        }}
        progress={user.levelProgress}
        interests={user.interests}
        profileImage={user.image}
      />

      {/* 식물 관리 상태 요약 (소유자에게만 보임) */}
      {isOwner && (
        <CareStatusSection
          needsWaterCount={user.needsWaterCount}
          needsNutrientCount={user.needsNutrientCount}
        />
      )}
    </section>
  );
}
