import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// 갤러리 아이템 타입 정의 - 실제 데이터베이스 구조에 맞춤
export interface GalleryItem {
  id: string;
  title: string;
  image: string; // imageUrl -> image로 변경
  createdAt: Date | string;
  likes: number;
  description?: string | null;
  author?: {
    id: string;
    name: string | null;
    image: string | null;
  };
  plant?: {
    id: string;
    name: string;
  } | null;
}

export interface GalleryGridProps {
  items: GalleryItem[];
}

export const GalleryGrid = ({ items }: GalleryGridProps) => {
  const photoCount = items.length;

  return (
    <div className="mx-auto w-full max-w-md px-4 pb-20">
      {photoCount > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {items.map((item, index) => {
            // createdAt이 Date 객체인 경우 문자열로 변환
            const dateString = item.createdAt instanceof Date 
              ? item.createdAt.toLocaleDateString('ko-KR')
              : new Date(item.createdAt).toLocaleDateString('ko-KR');

            return (
              <div
                key={item.id}
                className={`relative overflow-hidden rounded-lg shadow-lg transition-all duration-500 hover:shadow-xl ${
                  index % 3 === 0 ? 'col-span-2' : ''
                }`}>
                <div className="relative aspect-square">
                  <Image
                    src={item.image}
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
                          {dateString}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs opacity-80">
                            ❤️ {item.likes}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
  );
}; 