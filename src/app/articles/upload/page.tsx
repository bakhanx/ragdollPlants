import { Metadata } from 'next';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import { ContentsLayout } from '@/app/_components/layout/ContentsLayout';
import { Header } from '@/app/_components/header/Header';
import ArticleUploadForm from './_components/ArticleUploadForm';
import LoadingState from './_components/LoadingState';
import AdminAccessCheck from './_components/AdminAccessCheck';

export const metadata: Metadata = {
  title: '식물 뉴스 작성 - 라그돌플랜츠',
  description: '식물 관련 뉴스 및 정보를 작성하고 공유하세요'
};

export default function UploadArticlePage() {
  return (
    <>
      <BackgroundImage src="/images/welcome-bg-04.webp" />
      <ContentsLayout showFooter={false}>
        <Header
          title="식물 뉴스 작성"
          showBack={true}
        />

        {/* 클라이언트 컴포넌트들은 _components 폴더로 분리 */}
        <LoadingState />
        <AdminAccessCheck />
        <ArticleUploadForm />
      </ContentsLayout>
    </>
  );
}
