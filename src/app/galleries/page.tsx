import React from 'react';

import BackgroundImage from '../_components/layout/BackgroundImage';
import { ContentsLayout } from '../_components/layout/ContentsLayout';
import { Header } from '../_components/header/Header';
import Image from 'next/image';
import Link from 'next/link';
import { UploadButton } from '@/app/_components/common/UploadButton';

// 임시 갤러리 데이터
const galleryItems = [
  {
    id: 1,
    title: '봄에 피어난 몬스테라',
    imageUrl: '/images/welcome-bg-01.webp',
    createdAt: '2023-04-15',
    likes: 24
  },
  {
    id: 2,
    title: '화분을 새로 바꾼 후',
    imageUrl: '/images/welcome-bg-02.webp',
    createdAt: '2023-03-28',
    likes: 18
  },
  {
    id: 3,
    title: '창가에서',
    imageUrl: '/images/welcome-bg-03.webp',
    createdAt: '2023-03-10',
    likes: 32
  },
  {
    id: 4,
    title: '새순 돋아나는 순간',
    imageUrl: '/images/welcome-bg-04.webp',
    createdAt: '2023-02-15',
    likes: 42
  }
];

// 최대 갤러리 사진 개수
const MAX_GALLERY_PHOTOS = 10;

export default function GalleriesPage() {
  // 등록된 사진 개수
  const photoCount = galleryItems.length;

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-06.webp" />

      <ContentsLayout
        noPadding
        showFooter={false}>
        {/* 헤더 */}
        <Header
          title="갤러리"
          showNotification
          variant="glass"
        />

        {/* 갤러리 타이틀 섹션 */}
        <div className="mt-16 w-full p-4">
          <div className="relative flex flex-col items-center">
            <div className="text-center text-white">
              <h1 className="mb-1 text-3xl font-bold">My Plant Gallery</h1>
              <p className="mb-8 text-sm opacity-80">
                내 소중한 식물들의 아름다운 순간들
              </p>
              <div className="mx-auto mb-8 h-px w-16 bg-white opacity-30"></div>
            </div>

            {/* 버튼 절대 위치로 오른쪽 상단에 배치 */}
            <div className="absolute top-0 right-0">
              {/* 사진 추가 버튼 (아직 최대 사진 수에 도달하지 않은 경우만 표시) */}
              {photoCount < MAX_GALLERY_PHOTOS && (
                <UploadButton
                  link="/galleries/upload"
                  count={photoCount}
                  maxCount={MAX_GALLERY_PHOTOS}
                />
              )}
            </div>
          </div>
        </div>

        {/* 갤러리 그리드 */}
        <div className="mx-auto w-full max-w-md px-4 pb-20">
          {photoCount > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {galleryItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`relative overflow-hidden rounded-lg shadow-lg transition-all duration-500 hover:shadow-xl ${
                    index % 3 === 0 ? 'col-span-2' : ''
                  }`}>
                  <div className="relative aspect-square">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700"
                    />

                    {/* 오버레이 및 정보 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 hover:opacity-0">
                      <div className="absolute bottom-0 w-full p-4 text-white">
                        <h3 className="mb-1 text-lg font-semibold">
                          {item.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-xs opacity-80">
                            {item.createdAt}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg bg-black/30 text-center text-white">
              <p className="mb-4 text-lg">
                아직 등록된 갤러리 사진이 없습니다.
              </p>
              <Link
                href="/galleries/upload"
                className="rounded-full bg-white px-4 py-2 text-sm text-black transition-colors hover:bg-gray-100">
                첫 갤러리 등록하기
              </Link>
            </div>
          )}
        </div>
      </ContentsLayout>
    </>
  );
}
