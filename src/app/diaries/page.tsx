import BackgroundImage from '../_components/layout/BackgroundImage';
import ContentLayout from '../_components/layout/ContentsLayout';
import Header from '../_components/layout/Header';
import Link from 'next/link';
import FloatingButton from '@/app/_components/common/UploadButton';
import { diaryPosts } from '../_temp/diaryData';
import DiaryList from './_components/DiaryList';

export default function DiariesPage() {
  return (
    <>
      <BackgroundImage src="/images/welcome-bg-06.webp" />
      <ContentLayout>
        <Header title="식물 일기" showNotification />
        <div className="mt-6 flex justify-between items-center">
          <div className="max-w-xs" />
          <div>
            <Link href="/diaries/upload">
              <button className="rounded-md bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700">
                작성하기
              </button>
            </Link>
          </div>
        </div>
        <DiaryList initialPosts={diaryPosts} />
      </ContentLayout>
      <FloatingButton link="/diaries/upload" adminOnly={true} />
    </>
  );
}
