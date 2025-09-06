import { Suspense } from 'react';
import BackgroundImage from '../_components/layout/BackgroundImage';
import { ContentsLayout } from '../_components/layout/ContentsLayout';
import { Header } from '../_components/header/Header';
import { UploadButton } from '../_components/common/UploadButton';
import EventListWrapper from './_components/EventListWrapper';
import EventCardsSkeleton from './_components/EventCardsSkeleton';
import { checkIsAdmin } from '@/lib/auth-utils';

export default async function EventsPage() {
  const isAdmin = await checkIsAdmin();

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-05.webp" />
      <ContentsLayout>
        <Header title="이벤트" />

        <div className="w-full py-4">
          {/* 업로드 버튼 영역 */}
          {isAdmin && (
            <div className="mt-4 mb-6 flex justify-end">
              <UploadButton
                link="/events/upload"
                title="이벤트 등록"
              />
            </div>
          )}

          {/* 이벤트 목록 - Suspense로 감싸서 로딩 처리 */}
          <Suspense fallback={<EventCardsSkeleton />}>
            <EventListWrapper />
          </Suspense>
        </div>
      </ContentsLayout>
    </>
  );
}
