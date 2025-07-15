import React from 'react';
import { ProfileCardSkeleton } from './ProfileCardSkeleton';
import { CareStatusSectionSkeleton } from './CareStatusSectionSkeleton';

interface UserProfileSkeletonProps {
  showCareStatus?: boolean;
}

export const UserProfileSkeleton = ({ showCareStatus = false }: UserProfileSkeletonProps) => {
  return (
    <section className="mx-auto w-full max-w-2xl space-y-6 py-4">
      {/* 프로필 카드 */}
      <ProfileCardSkeleton />

      {/* 케어 상태 (소유자에게만) */}
      {showCareStatus && <CareStatusSectionSkeleton />}
    </section>
  );
};