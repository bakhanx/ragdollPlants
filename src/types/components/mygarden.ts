/**
 * MyGarden 관련 컴포넌트 Props 타입 정의
 */

import { User, UserStats, PlantCareStats, PlantInterest } from '../models/user';

/**
 * 사용자 프로필 컴포넌트 Props
 */
export interface UserProfileProps {
  nickname: string;
  level: number;
  stats: UserStats;
  levelProgress?: number;
  todayWaterCount?: number;
  todayNutrientCount?: number;
  interests?: string[];
}

/**
 * 프로필 이미지 컴포넌트 Props
 */
export interface ProfileImageProps {
  src: string;
  alt: string;
  showEditHint?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 통계 카드 컴포넌트 Props
 */
export interface CountStatCardProps {
  value: number;
  label: string;
  href?: string;
}

/**
 * 레벨 진행률 컴포넌트 Props
 */
export interface LevelProgressProps {
  progress: number;
  currentLevel?: number;
  nextLevel?: number;
}

/**
 * 케어 상태 카드 컴포넌트 Props
 */
export interface CareStatusCardProps {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  count: number;
  href?: string;
  textColor?: string;
}

/**
 * 식물 제목 컴포넌트 Props
 */
export interface PlantTitleProps {
  interests: string[];
}

/**
 * 프로필 편집 폼 컴포넌트 Props
 */
export interface EditProfileFormProps {
  initialData: Partial<User>;
  onSubmit: (data: User) => Promise<void>;
  isLoading?: boolean;
} 