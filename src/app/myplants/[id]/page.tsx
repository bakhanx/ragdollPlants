'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import BackgroundImage from '@/app/_components/layout/BackgroundImage';
import ContentLayout from '@/app/_components/layout/ContentsLayout';
import Header from '@/app/_components/layout/Header';
import { WaterIcon, NutrientIcon, EditIcon } from '@/app/_components/icons/Icons';

// 임시 데이터 - 후에 실제 API 연동으로 대체
const plantDetails = {
  id: 1,
  name: '몬스테라',
  imageUrl: '/images/welcome-bg-01.webp',
  plantType: '실내식물',
  location: '거실 창가',
  acquiredDate: '2023-01-15',
  lastWatered: '2023-04-10',
  wateringCycle: 7, // 일 단위
  lastFertilized: '2023-03-20',
  fertilizerCycle: 30, // 일 단위
  notes: '습도가 높은 환경을 좋아하며, 직사광선은 피하는 것이 좋습니다.',
  needsWater: true,
  needsNutrient: false,
};

// 최근 다이어리 데이터
const recentDiaries = [
  {
    id: 101,
    date: '2023-04-18',
    title: '새 잎이 돋아났어요',
    hasImage: true,
    excerpt: '오늘 아침에 확인해보니 새 잎이 나오기 시작했어요. 생각보다 빠르게 자라서 놀랐습니다...'
  },
  {
    id: 102,
    date: '2023-04-15',
    title: '물주기 & 분무',
    hasImage: true,
    excerpt: '일주일만에 물을 주고 잎에 분무도 해줬어요. 건조한 날씨 때문에 잎이 조금 말라보여서...'
  },
  {
    id: 103,
    date: '2023-04-10',
    title: '위치 변경',
    hasImage: false,
    excerpt: '햇빛이 잘 들어오는 창가로 위치를 옮겼어요. 몬스테라가 더 건강하게 자랐으면 좋겠습니다...'
  }
];

// 날짜 포맷 함수
function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('ko-KR', options);
}

// 남은 일수 계산 함수
function getDaysRemaining(lastDate: string, cycleDays: number) {
  const last = new Date(lastDate);
  const next = new Date(last);
  next.setDate(last.getDate() + cycleDays);
  
  const today = new Date();
  const diffTime = next.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

export default function PlantDetailPage() {
  const params = useParams();
  const plantId = params.id;
  
  // 실제 구현에서는 여기서 plantId를 사용하여 데이터를 가져옴
  // 현재는 임시 데이터 사용
  
  const waterDaysRemaining = getDaysRemaining(plantDetails.lastWatered, plantDetails.wateringCycle);
  const nutrientDaysRemaining = getDaysRemaining(plantDetails.lastFertilized, plantDetails.fertilizerCycle);

  return (
    <>
      <BackgroundImage src="/images/welcome-bg-05.webp" />
      <ContentLayout>
        <Header
          title={plantDetails.name}
          showBack
        />
        
        <div className="w-full divide-y divide-gray-100">
          {/* 식물 기본 정보 */}
          <div className="flex flex-col py-4">
            <div className="relative mx-auto mb-4 aspect-square w-full rounded-md overflow-hidden">
              <Image
                src={plantDetails.imageUrl}
                alt={plantDetails.name}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="mx-auto mb-2 mt-2 flex items-center space-x-2">
              <h1 className="text-center text-2xl font-bold">{plantDetails.name}</h1>
              <Link href={`/myplants/${plantId}/edit`} className="text-gray-500">
                <EditIcon size={18} />
              </Link>
            </div>
            
            <div className="text-center text-sm text-gray-50">
              <p>{plantDetails.plantType} • {plantDetails.location}</p>
              <p>입양일: {formatDate(plantDetails.acquiredDate)}</p>
            </div>
          </div>
          
          {/* 식물 케어 정보 */}
          <div className="py-4">
            <h2 className="mb-3 text-lg font-semibold">식물 케어</h2>
            
            <div className="mb-3 flex items-center justify-between rounded-lg bg-blue-50 p-3">
              <div className="flex items-center">
                <div className="mr-3 rounded-full bg-blue-100 p-2">
                  <WaterIcon size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">물주기</h3>
                  <p className="text-sm text-gray-600">
                    마지막: {formatDate(plantDetails.lastWatered)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {waterDaysRemaining <= 0 ? (
                  <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">물주기 필요</span>
                ) : (
                  <span className="text-sm text-gray-600">{waterDaysRemaining}일 후</span>
                )}
              </div>
            </div>
            
            <div className="mb-3 flex items-center justify-between rounded-lg bg-amber-50 p-3">
              <div className="flex items-center">
                <div className="mr-3 rounded-full bg-amber-100 p-2">
                  <NutrientIcon size={20} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="font-medium">영양제</h3>
                  <p className="text-sm text-gray-600">
                    마지막: {formatDate(plantDetails.lastFertilized)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {nutrientDaysRemaining <= 0 ? (
                  <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">영양제 필요</span>
                ) : (
                  <span className="text-sm text-gray-600">{nutrientDaysRemaining}일 후</span>
                )}
              </div>
            </div>
            
            {plantDetails.notes && (
              <div className="rounded-lg bg-gray-50 p-3">
                <h3 className="mb-1 font-medium">메모</h3>
                <p className="text-sm text-gray-600">{plantDetails.notes}</p>
              </div>
            )}
            
            <div className="mt-3 flex justify-end">
              <Link 
                href={`/myplants/${plantId}/care`}
                className="rounded-md bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
              >
                케어 관리
              </Link>
            </div>
          </div>
          
          {/* 최근 다이어리 */}
          <div className="py-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">최근 일기</h2>
              <Link 
                href={`/diaries?plantId=${plantId}`}
                className="text-sm text-green-600 hover:text-green-700"
              >
                모두 보기
              </Link>
            </div>
            
            <div className="space-y-3">
              {recentDiaries.map(diary => (
                <Link 
                  key={diary.id}
                  href={`/diaries/${diary.id}`}
                  className="flex items-start rounded-lg bg-white p-3 shadow-sm hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{diary.title}</h3>
                      <span className="text-xs text-gray-500">{formatDate(diary.date)}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">{diary.excerpt}</p>
                  </div>
                  {diary.hasImage && (
                    <div className="ml-3 flex h-12 w-12 items-center justify-center rounded bg-gray-100 text-xs text-gray-500">
                      사진
                    </div>
                  )}
                </Link>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <Link 
                href={`/diaries/create?plantId=${plantId}`}
                className="inline-block rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
              >
                일기 작성하기
              </Link>
            </div>
          </div>
        </div>
      </ContentLayout>
    </>
  );
} 