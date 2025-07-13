import React from 'react';
import Link from 'next/link';
import { Card } from '@/app/_components/common/Card';
import ProfileImage from './ProfileImage';
import UserInfoSection from './UserInfoSection';
import LevelProgress from './LevelProgress';
import PlantTitle from '../PlantTitle';

interface ProfileCardProps {
  nickname: string;
  level: number;
  stats: {
    visitors: number;
    galleries: number;
    plants: number;
  };
  levelProgress: number;
  interests: string[];
  profileImage?: string | null;
}

export default function ProfileCard({
  nickname,
  level,
  stats,
  levelProgress,
  interests,
  profileImage
}: ProfileCardProps) {
  return (
    <Card className="p-5" isHover={false}>
      <div className="relative flex gap-5">
        <Link
          href="/mygarden/profile"
          className="hover:opacity-80">
          <ProfileImage
            src={profileImage || "/images/Profile.webp"}
            alt={nickname}
            showEditHint={true}
          />
        </Link>

        <UserInfoSection 
          nickname={nickname}
          level={level}
          stats={stats}
        />
      </div>

      <LevelProgress progress={levelProgress} />

      {/* 관심사 태그 */}
      <div className="mt-4">
        <PlantTitle interests={interests} />
      </div>
    </Card>
  );
} 