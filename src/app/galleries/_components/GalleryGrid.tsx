'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GalleryImageModal } from './GalleryImageModal';
import { GalleriesResponse } from '@/types/cache/gallery';
import { GRAY_PLACEHOLDER } from '@/app/_constants/imagePlaceholders';
import { getImageSrc } from '@/app/_utils/imageUtils';

interface GalleryGridProps {
  initialData: GalleriesResponse | null;
  isLoggedIn?: boolean;
}

export const GalleryGrid = ({
  initialData,
  isLoggedIn = false
}: GalleryGridProps) => {
  const router = useRouter();
  if (!initialData) {
    return (
      <div className="mx-auto w-full max-w-md px-4 pb-20">
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-center">
          <p className="text-red-600">갤러리 데이터를 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const items = initialData.galleries;
  const isOwner = initialData.isOwner || false;

  // 업로드 버튼 클릭 핸들러
  const handleUploadClick = () => {
    if (!isLoggedIn) {
      confirm('로그인 페이지로 이동하시겠습니까?');
      router.push('/login');
      return;
    }
    router.push('/galleries/upload');
  };

  const photoCount = items.length;

  if (photoCount === 0) {
    return (
      <div className="mx-auto w-full max-w-md px-4 pb-20">
        {/* 대표 작품 스켈레톤 */}
        <div className="mb-6">
          <div className="relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-white/20 bg-black/30 shadow-2xl">
            <div className="relative flex aspect-[4/3] items-center justify-center">
              <div className="text-center text-white">
                <div className="mb-3 flex justify-center">
                  <svg
                    className="h-8 w-8 text-white/60"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold">대표 작품</h3>
                <p className="mb-3 text-sm opacity-70">
                  첫 번째 사진이 여기에 표시됩니다
                </p>
                {isOwner && (
                  <button
                    onClick={handleUploadClick}
                    className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm text-black transition-colors hover:bg-gray-100">
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    첫 갤러리 등록하기
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3x3 그리드 스켈레톤 */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">최근 갤러리</h3>
            <div className="text-sm text-white/60">0개의 작품</div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={index}
                className="relative flex aspect-square items-center justify-center rounded-lg border border-dashed border-white/10 bg-black/20">
                <div className="text-center text-white/40">
                  <svg
                    className="mx-auto mb-1 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div className="text-xs">{index + 1}번째</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const featuredItem = items[0];
  const gridItems = items.slice(1);

  return (
    <div className="mx-auto w-full max-w-md px-4 pb-20">
      {/* 대표 작품 */}
      <div className="mb-6">
        <GalleryImageModal
          item={featuredItem}
          isOwner={isOwner}>
          <div className="relative cursor-pointer overflow-hidden rounded-2xl shadow-2xl transition-transform duration-300 hover:scale-[1.02]">
            <div className="relative aspect-[4/3]">
              <Image
                src={getImageSrc(featuredItem.image, 'medium')}
                alt={featuredItem.title}
                fill
                placeholder="blur"
                blurDataURL={GRAY_PLACEHOLDER}
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
                unoptimized
              />

              {/* 그라데이션 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                <div className="absolute bottom-0 w-full p-6 text-white">
                  <div className="mb-2 flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-green-400"></div>
                    <span className="text-xs font-medium tracking-wide text-green-400 uppercase">
                      대표 작품
                    </span>
                  </div>
                  <h2 className="mb-2 text-xl leading-tight font-bold">
                    {featuredItem.title}
                  </h2>
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-90">
                      {new Date(featuredItem.createdAt).toLocaleDateString(
                        'ko-KR'
                      )}
                    </span>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm">❤️</span>
                      <span className="text-sm font-medium">
                        {featuredItem.likes || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 클릭 힌트 */}
              <div className="absolute top-4 right-4 rounded-full bg-black/30 p-2 backdrop-blur-sm transition-opacity duration-300 hover:bg-black/50">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </GalleryImageModal>
      </div>

      {/* 컴팩트 그리드 갤러리 */}
      <div className="space-y-6">
        {/* 섹션 타이틀 */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">최근 갤러리</h3>
          <div className="text-sm text-white/60">
            {gridItems.length}개의 작품
          </div>
        </div>

        {/* 3x3 그리드 */}
        <div className="grid grid-cols-3 gap-2">
          {/* 실제 이미지들 먼저 표시 */}
          {gridItems.map(item => (
            <GalleryImageModal
              key={item.id}
              item={item}
              isOwner={isOwner}>
              <div className="group relative cursor-pointer overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="relative aspect-square">
                  <Image
                    src={getImageSrc(item.image, 'small')}
                    alt={item.title}
                    sizes="224px"
                    quality={75}
                    fill
                    placeholder="blur"
                    blurDataURL={GRAY_PLACEHOLDER}
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    unoptimized
                  />

                  {/* 호버 오버레이 */}
                  <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/40">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="text-center text-white">
                        <div className="mb-1 text-xs font-medium">
                          ❤️ {item.likes || 0}
                        </div>
                        <div className="text-xs opacity-80">
                          {new Date(item.createdAt).toLocaleDateString(
                            'ko-KR',
                            {
                              month: 'short',
                              day: 'numeric'
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GalleryImageModal>
          ))}

          {/* 추가 버튼 - 9개를 다 채우지 않았을 때만 */}
          {isOwner && gridItems.length < 9 && (
            <button
              onClick={handleUploadClick}
              className="group relative cursor-pointer overflow-hidden rounded-lg border-2 border-dashed border-white/20 bg-black/30 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="relative flex aspect-square items-center justify-center">
                <div className="text-center text-white">
                  <svg
                    className="mx-auto mb-1 h-6 w-6 transition-transform group-hover:scale-110"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <div className="text-xs font-medium">추가</div>
                </div>
              </div>
            </button>
          )}

          {/* 나머지 빈 칸들 (9개 중 남은 칸들) */}
          {Array.from({
            length: Math.max(
              0,
              9 - gridItems.length - (isOwner && gridItems.length < 9 ? 1 : 0)
            )
          }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="relative flex aspect-square items-center justify-center rounded-lg border border-dashed border-white/10 bg-black/20">
              <div className="text-center text-white/40">
                <svg
                  className="mx-auto mb-1 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div className="text-xs">
                  {gridItems.length +
                    (isOwner && gridItems.length < 9 ? 1 : 0) +
                    index +
                    1}
                  번째
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
