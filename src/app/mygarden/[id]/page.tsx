import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-utils';
import { getUserProfileData } from '@/app/actions/userProfile';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import { MenuList } from '@/app/_components/lists/MenuList';
import UserProfile from '@/app/mygarden/_components/profile/UserProfile';
import { EditIcon } from '@/app/_components/icons';
import LogoutButton from '@/app/mygarden/_components/LogoutButton';

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { userId } = await params;

  const [user, currentUser] = await Promise.all([
    getUserProfileData(userId),
    getCurrentUser().catch(() => null) // 로그인 안 한 경우를 대비
  ]);

  if (!user) {
    notFound();
  }

  const isOwner = currentUser?.id === user.id;

  // 비공개 프로필이며, 소유자가 아닐 경우 접근 제한
  if (!user.isProfilePublic && !isOwner) {
    return (
      <>
        <BackgroundImage src="/images/welcome-bg-03.webp" />
        <ContentsLayout>
          <Header
            title="비공개 프로필"
            showBack
          />
          <div className="flex h-full flex-col items-center justify-center text-center">
            <h2 className="mb-2 text-2xl font-bold">비공개 프로필</h2>
            <p>이 사용자의 프로필은 비공개로 설정되어 있습니다.</p>
          </div>
        </ContentsLayout>
      </>
    );
  }

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-03.webp" />
      <ContentsLayout>
        <Header
          title={`${user.name || '사용자'}님의 정원`}
          showNotification={isOwner} // 자신의 프로필에서만 알림 표시
          showBack={!isOwner} // 다른 사람 프로필에서만 뒤로가기 표시
        />

        <div className="relative mb-4">
          <UserProfile
            user={user}
            isOwner={isOwner}
          />

          {isOwner && (
            <div className="absolute top-7 right-5 flex gap-2">
              <Link
                href="/mygarden/profile"
                className="rounded-full bg-white/80 p-2 shadow-sm transition-colors hover:bg-white/100"
                aria-label="프로필 편집">
                <EditIcon
                  size={20}
                  className="text-gray-600"
                />
              </Link>
              <LogoutButton />
            </div>
          )}
        </div>

        {/* MenuList도 isOwner 여부에 따라 다르게 표시해야 할 수 있음 */}
        <MenuList
          userId={userId}
          isOwner={isOwner}
          currentUserId={currentUser?.id}
        />
      </ContentsLayout>
    </>
  );
}
