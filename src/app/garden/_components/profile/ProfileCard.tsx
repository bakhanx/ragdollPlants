'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/app/_components/common/Card';
import ProfileImage from './ProfileImage';
import UserInfoSection from './UserInfoSection';
import LevelProgress from './LevelProgress';
import PlantTitle from '../PlantTitle';
import { shouldShowBioToggle, getTruncatedBio } from './bioUtils';
interface ProfileCardProps {
  nickname: string;
  loginId: string;
  bio?: string | null;
  level: number;
  levelTitle: string;
  stats: {
    diaries: number;
    galleries: number;
    careCount: number;
  };
  progress: number;
  interests: string[];
  profileImage?: string | null;
}

export default function ProfileCard({
  nickname,
  loginId,
  bio,
  level,
  levelTitle,
  stats,
  progress,
  interests,
  profileImage
}: ProfileCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const shouldShowToggle = shouldShowBioToggle(bio);

  return (
    <Card
      className="p-5"
      isHover={false}>
      <div className="relative flex gap-5">
        <Link
          href="/garden/profile"
          className="hover:opacity-80">
          <ProfileImage
            src={profileImage || '/images/default-img.webp'}
            alt={nickname}
            showEditHint={true}
          />
        </Link>

        <UserInfoSection
          nickname={nickname}
          level={level}
          levelTitle={levelTitle}
          stats={stats}
        />
      </div>

      {/* Biography*/}
      <div className="mt-2">
        <div className="mb-1 text-sm font-semibold text-gray-700">
          @{loginId}
        </div>
        {bio && (
          <div className="text-xs text-gray-700 leading-relaxed">
            <span className="whitespace-pre-wrap">
              {isExpanded ? bio : getTruncatedBio(bio || '')}
            </span>
            {shouldShowToggle && (
              <>
                {!isExpanded && <span>...</span>}
                <button
                  type="button"
                  className="ml-1 text-[11px] font-medium text-gray-400 hover:text-gray-600"
                  onClick={() => setIsExpanded(prev => !prev)}>
                  {isExpanded ? '접기' : '더 보기'}
                </button>
              </>
            )}
          </div>
        )}
      </div>
      <LevelProgress progress={progress} />

      {/* 관심사 태그 */}
      <div className="mt-4">
        <PlantTitle interests={interests} />
      </div>
    </Card>
  );
}
