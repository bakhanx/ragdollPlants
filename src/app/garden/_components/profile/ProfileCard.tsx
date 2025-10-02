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
      className="p-4"
      isHover={false}>
      <div className="relative flex sm:gap-5 gap-3 ">
        <Link
          href="/garden/profile"
          className="hover:opacity-80">
          <ProfileImage
            src={profileImage}
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
        <div className="mb-1 sm:text-sm text-xs font-semibold text-gray-800">
          @{loginId}
        </div>
        {bio && (
          <div className="sm:text-sm text-xs text-gray-800 leading-relaxed">
            <span className="whitespace-pre-wrap">
              {isExpanded ? bio : getTruncatedBio(bio || '')}
            </span>
            {shouldShowToggle && (
              <>
                {!isExpanded && <span>...</span>}
                <button
                  type="button"
                  className="ml-1 sm:text-sm text-xs font-medium text-gray-500 hover:text-gray-600"
                  onClick={() => setIsExpanded(prev => !prev)}>
                  {isExpanded ? '접기' : '더보기'}
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
