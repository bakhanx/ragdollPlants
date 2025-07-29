import React from 'react';
import { getUserProfileData } from '@/app/actions/userProfile';
import { getCurrentUser } from '@/lib/auth-utils';
import UserProfile from './UserProfile';

interface UserProfileWrapperProps {
  userId: string;
}

export async function UserProfileWrapper({ userId }: UserProfileWrapperProps) {
  const [user, currentUser] = await Promise.all([
    getUserProfileData(userId),
    getCurrentUser().catch(() => null)
  ]);

  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  const isOwner = currentUser?.id === user.id;

  return <UserProfile user={user} isOwner={isOwner} />;
}