'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

import { EditIcon } from '@/app/_components/icons';
import { Button } from '@/app/_components/common/Button';

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

type User = {
  id: string;
  name: string | null;
  email: string;
  bio: string | null;
  image: string | null;
  interests: string[];
  level: number;
  levelProgress: number;
  waterCount: number;
  nutrientCount: number;
  todayWaterCount: number;
  todayNutrientCount: number;
  _count: {
    plants: number;
    followersList: number;
    galleries: number;
  };
};

type EditProfileProps = {
  userId: string;
  onCancel: () => void;
};

export default function EditProfile({ userId, onCancel }: EditProfileProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 상태 관리
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    profileImage: ''
  });

  // 이미지 프리뷰 상태
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 선택된 관심사 상태
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // 사용자 프로필 데이터 로드
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.user?.id) return;
      
      try {
        setLoading(true);
        
        // Server Action 동적 import
        const { getUserProfileData } = await import('@/app/actions/userProfile');
        
        // Server Action 호출
        const userData = await getUserProfileData(session.user.id);
        
        if (!userData) {
          throw new Error('사용자 데이터를 찾을 수 없습니다');
        }
        
        setUser({
          ...userData,
          email: session.user.email || ''
        });
        setFormData({
          name: userData.name || '',
          email: session.user.email || '',
          bio: userData.bio || '',
          profileImage: userData.image || ''
        });
        setImagePreview(userData.image);
        setSelectedInterests(userData.interests || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchUserProfile();
    }
  }, [session]);

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
      // 파일 크기 체크 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        setError('이미지 파일은 5MB 이하여야 합니다');
        return;
      }

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

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      setError('로그인이 필요합니다');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // FormData 생성
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('name', formData.name.trim());
      formDataToSubmit.append('bio', formData.bio.trim());
      formDataToSubmit.append('interests', JSON.stringify(selectedInterests));
      formDataToSubmit.append('image', formData.profileImage);

      // Server Action 동적 import
      const { updateUserProfile } = await import('@/app/actions/userProfile');
      
      // Server Action 호출
      await updateUserProfile(formDataToSubmit);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다');
      setSubmitting(false);
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="space-y-5 rounded-xl border border-green-100 bg-white/50 p-5">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
            <p className="text-gray-600">프로필을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error && !user) {
    return (
      <div className="space-y-5 rounded-xl border border-red-100 bg-white/50 p-5">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-red-500 hover:bg-red-600"
          >
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 rounded-xl border border-green-100 bg-white/50 p-5">
      <h2 className="text-xl font-bold text-gray-800">📝 프로필 수정</h2>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
            className="group relative my-2 size-24 cursor-pointer overflow-hidden rounded-2xl border-2 border-green-200 shadow-lg sm:size-28"
            onClick={handleImageSelect}>
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="프로필 이미지"
                fill
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100">
                <span className="text-gray-400 text-sm">이미지 없음</span>
              </div>
            )}

            {/* 호버 시 보여줄 편집 힌트 */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex flex-col items-center gap-1 text-white">
                <EditIcon
                  size={24}
                  className="[&_path]:stroke-white"
                />
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
            이름 *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-md border-2 border-gray-300 p-2 focus:border-green-600 focus:ring-1 focus:ring-green-600 focus:outline-none"
            required
            disabled={submitting}
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
            className="w-full rounded-md border-2 border-gray-200 bg-gray-50 p-2 text-gray-500"
            disabled
            readOnly
          />
          <p className="mt-1 text-xs text-gray-500">이메일은 변경할 수 없습니다</p>
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
            className="min-h-[100px] w-full resize-none rounded-md border-2 border-gray-300 p-2 focus:border-green-600 focus:ring-1 focus:ring-green-600 focus:outline-none"
            disabled={submitting}
            placeholder="자신을 소개해보세요..."
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
                disabled={
                  submitting ||
                  (selectedInterests.length >= 20 &&
                    !selectedInterests.includes(title))
                }
                className={`rounded-md px-2 py-1 text-xs transition-colors disabled:opacity-50 ${
                  selectedInterests.includes(title)
                    ? 'bg-[#3082ce] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}>
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
            disabled={submitting}
            className="flex-1"
          >
            {submitting ? '저장 중...' : '저장하기'}
          </Button>
          <Button
            type="button"
            className="flex-1 bg-gray-500 hover:bg-gray-600"
            onClick={onCancel}
            disabled={submitting}>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
