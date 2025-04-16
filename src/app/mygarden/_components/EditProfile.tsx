'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/app/_components/common/Card';
import { userProfileData } from '@/app/_temp/userData';
import Image from 'next/image';
import Button from '@/app/_components/common/Button';
import { EditIcon } from '@/app/_components/icons';

// PlantTitle에서 가져온 식물 카테고리 목록
const PlantTitles = [
  '관엽',
  '침엽수',
  '다육',
  '야생화',
  '수경',
  '열대',
  '허브',
  '착생',
  '화초',
  '관화',
  '양치',
  '과일나무',
  '약용',
  '정원',
  '덩굴',
  '분재',
  '꽃나무',
  '공기정화',
  '동양란',
  '서양란',
  '묘목',
  '모종',
  '씨앗',
  '수생',
  '행잉',
  '테라리움',
  '비바리움',
  '팔루다리움',
  '이끼',
  '식충',
  '채소',
  '곡물',
  '리톱스'
];

type EditProfileProps = {
  userId: string;
  onCancel: () => void;
};

export default function EditProfile({ userId, onCancel }: EditProfileProps) {
  // 사용자 찾기
  const user =
    userProfileData.find(user => user.id === userId) || userProfileData[0];

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    bio: user.bio,
    profileImage: user.profileImage
  });

  // 이미지 프리뷰 상태
  const [imagePreview, setImagePreview] = useState<string | null>(
    user.profileImage
  );

  // 선택된 관심사 상태
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    user.interests || PlantTitles.slice(20, 25) // 기본값으로 일부 식물 카테고리 선택
  );

  // 입력 핸들러
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 이미지 선택 핸들러
  const handleImageSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 이미지 변경 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, profileImage: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 관심사 토글 핸들러
  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(item => item !== interest)
        : [...prev, interest]
    );
  };

  // 폼 제출 핸들러 (실제로는 API 호출 필요)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 여기서 실제로는 API 통신을 통해 프로필 및 관심사를 업데이트해야 함
    // 현재는 Mock 데이터라 클라이언트에서만 변경

    alert('프로필이 성공적으로 업데이트되었습니다.');
    onCancel(); // 편집 모드 종료

    // 변경 사항을 반영하기 위해 페이지 새로고침
    router.refresh();
  };

  return (
    <div className="space-y-5 p-5 rounded-xl border border-green-100 bg-white/50">
      <h2 className="text-xl font-bold text-gray-800">📝 프로필 수정</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4">
        {/* 프로필 이미지 업로드 */}
        <div className="mb-6 flex flex-col items-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          
          <div 
            className="relative my-2 size-24 overflow-hidden rounded-2xl border-2 border-green-200 shadow-lg sm:size-28 group cursor-pointer" 
            onClick={handleImageSelect}
          >
            {imagePreview && (
              <Image
                src={imagePreview}
                alt="프로필 이미지"
                fill
                style={{ objectFit: 'cover' }}
              />
            )}
            
            {/* 호버 시 보여줄 편집 힌트 */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex flex-col items-center gap-1 text-white">
                <EditIcon size={24} className="[&_path]:stroke-white" />
                <span className="text-xs font-medium">이미지 변경</span>
              </div>
            </div>
          </div>
          
          <Button
            type="button"
            onClick={handleImageSelect}
            className="mt-3 bg-blue-500 hover:bg-blue-600">
            이미지 변경
          </Button>
        </div>

        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-gray-700">
            이름
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-md border-2 border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600"
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-700">
            이메일
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-md border-2 border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600"
            required
          />
        </div>

        <div>
          <label
            htmlFor="bio"
            className="mb-1 block text-sm font-medium text-gray-700">
            자기소개
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="min-h-[100px] w-full rounded-md border-2 border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600 resize-none"
          />
        </div>

        {/* 관심사 선택 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            관심 있는 식물 카테고리 (최대 20개)
          </label>
          <div className="flex flex-wrap gap-2 rounded-md border border-gray-300 p-2">
            {PlantTitles.map(title => (
              <button
                key={title}
                type="button"
                onClick={() => toggleInterest(title)}
                className={`rounded-md px-2 py-1 text-xs transition-colors ${
                  selectedInterests.includes(title)
                    ? 'bg-[#3082ce] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                disabled={
                  selectedInterests.length >= 20 &&
                  !selectedInterests.includes(title)
                }>
                {title}
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            선택된 카테고리: {selectedInterests.length}/20
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            className="flex-1">
            저장하기
          </Button>
          <Button
            type="button"
            className="flex-1 bg-gray-500 hover:bg-gray-600"
            onClick={onCancel}>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
