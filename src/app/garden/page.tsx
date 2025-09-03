import React, { Suspense } from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth-utils';
import { getUserProfile } from '@/app/actions/userProfile';
import { AuthMismatchHandler } from '@/app/_components/auth/AuthMismatchHandler';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import { MenuList } from '@/app/_components/lists/MenuList';
import { UserProfileWrapper } from '@/app/garden/_components/profile/UserProfileWrapper';
import { UserProfileSkeleton } from '@/app/garden/_components/profile/UserProfileSkeleton';
import { EditIcon } from '@/app/_components/icons';
import LogoutButton from '@/app/garden/_components/LogoutButton';

interface PageProps {
  searchParams: Promise<{
    user?: string;
  }>;
}

// 사용자 기본 정보와 권한 확인하는 함수
async function getUserBasicInfo(targetLoginId?: string) {
  const currentUser = await getCurrentUser();

  // 비로그인 사용자이고 특정 유저 지정이 없으면 데모 데이터
  if (!currentUser && !targetLoginId) {
    // 데모 사용자 데이터 반환 (getUserProfile에서 처리)
    const demoUser = await getUserProfile('demo-user');
    return { user: demoUser, currentUser: null, isOwner: false };
  }

  // 타겟 사용자 결정: 쿼리 파라미터 > 현재 사용자 > 데모
  const loginId = targetLoginId || currentUser?.loginId || 'demo-user';

  const user = await getUserProfile(loginId);
  if (!user) {
    return { user: null, currentUser, isOwner: false };
  }

  const isOwner = currentUser?.id === user.id;
  return { user, currentUser, isOwner };
}

export default async function GardenPage({ searchParams }: PageProps) {
  const { user: targetUser } = await searchParams;
  const { user, currentUser, isOwner } = await getUserBasicInfo(targetUser);

  // 사용자를 찾을 수 없는 경우
  if (!user) {
    // 세션이 있지만 DB에 사용자가 없는 경우
    if (currentUser) {
      return <AuthMismatchHandler />;
    }

    return (
      <>
        <BackgroundImage src="/images/welcome-bg-03.webp" />
        <ContentsLayout>
          <Header
            title="사용자를 찾을 수 없음"
            showBack
          />
          <div className="flex h-full flex-col items-center justify-center text-center">
            <h2 className="mb-2 text-2xl font-bold">
              사용자를 찾을 수 없습니다
            </h2>
            <p>요청하신 사용자가 존재하지 않습니다.</p>
          </div>
        </ContentsLayout>
      </>
    );
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
                href="/garden/profile"
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
          userLoginId={user.loginId || undefined}
          currentUserId={currentUser?.id}
        />
      </ContentsLayout>
    </>
  );
}
