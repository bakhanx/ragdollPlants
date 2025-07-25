import React, { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-utils';
import {
  getUserProfileByUsername,
  getUserProfileData
} from '@/app/actions/userProfile';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import { MenuList } from '@/app/_components/lists/MenuList';
import { UserProfileWrapper } from '@/app/mygarden/_components/profile/UserProfileWrapper';
import { UserProfileSkeleton } from '@/app/mygarden/_components/profile/UserProfileSkeleton';
import { EditIcon } from '@/app/_components/icons';
import LogoutButton from '@/app/mygarden/_components/LogoutButton';

interface PageProps {
  searchParams: Promise<{
    username?: string;
  }>;
}

// 사용자 기본 정보와 권한만 확인하는 함수
async function getUserBasicInfo(username?: string) {
  const currentUser = await getCurrentUser().catch(() => null);

  if (!currentUser) {
    return { user: null, currentUser: null, isOwner: false };
  }

  let user;
  let isOwner = false;

  if (username) {
    // 다른 사용자의 정원 조회
    user = await getUserProfileByUsername(username);
    isOwner = currentUser.id === user?.id;
  } else {
    // 본인 정원 조회
    user = await getUserProfileData(currentUser.id);
    isOwner = true;
  }

  return { user, currentUser, isOwner };
}

export default async function MyGardenPage({ searchParams }: PageProps) {
  const { username } = await searchParams;
  const { user, currentUser, isOwner } = await getUserBasicInfo(username);

  // 로그인하지 않은 경우
  if (!currentUser) {
    return (
      <>
        <BackgroundImage src="/images/welcome-bg-03.webp" />
        <ContentsLayout>
          <Header
            title="로그인 필요"
            showBack
          />
          <div className="flex h-full flex-col items-center justify-center text-center">
            <h2 className="mb-2 text-2xl font-bold">로그인이 필요합니다</h2>
            <p>정원을 보려면 로그인해주세요.</p>
            <Link
              href="/auth/signin"
              className="mt-4 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">
              로그인하기
            </Link>
          </div>
        </ContentsLayout>
      </>
    );
  }

  // 사용자를 찾을 수 없는 경우
  if (!user) {
    notFound();
  }

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
