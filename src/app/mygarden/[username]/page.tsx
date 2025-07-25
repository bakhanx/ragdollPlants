import React, { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-utils';
import { getUserProfileData } from '@/app/actions/userProfile';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import { MenuList } from '@/app/_components/lists/MenuList';
import { UserProfileWrapper } from '@/app/mygarden/_components/profile/UserProfileWrapper';
import { UserProfileSkeleton } from '@/app/mygarden/_components/profile/UserProfileSkeleton';
import { EditIcon } from '@/app/_components/icons';
import LogoutButton from '@/app/mygarden/_components/LogoutButton';

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

// 사용자 기본 정보와 권한만 확인하는 함수
async function getUserBasicInfo(username: string) {
  const [user, currentUser] = await Promise.all([
    getUserProfileData(decodeURIComponent(username)),
    getCurrentUser().catch(() => null)
  ]);

  if (!user) {
    notFound();
  }

  const isOwner = currentUser?.id === user.id;

  return { user, currentUser, isOwner };
}

export default async function Page({ params }: PageProps) {
  const { username } = await params;
  const { user, currentUser, isOwner } = await getUserBasicInfo(username);

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
          showNotification={isOwner}
          showBack={!isOwner}
        />

        <div className="relative mb-4">
          <Suspense fallback={<UserProfileSkeleton showCareStatus={isOwner} />}>
            <UserProfileWrapper userId={user.id} />
          </Suspense>

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

        <MenuList
          userId={user.id}
          currentUserId={currentUser?.id}
        />
      </ContentsLayout>
    </>
  );
}
