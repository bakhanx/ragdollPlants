/**
 * User 모델 타입 정의
 * Prisma와 Supabase를 고려한 구조
 */

// 권장 패턴:
// 1. 객체 모델: interface 사용
// 2. 유니온/리터럴 타입: type 사용
// 3. 임시/변환 타입: type 사용 (접두사 Legacy 또는 접미사 Compat 추가)

/**
 * 식물 관심사 카테고리
 */
export type PlantInterest = 
  | '관엽' | '다육' | '허브' | '공기정화' | '식충' | '수경' | '수생'
  | '리톱스' | '테라리움' | '비바리움' | '모종' | '채소' | '과일나무' | '곡물'
  | '행잉' | '씨앗' | '약용' | '꽃나무' | '화초' | '관화' | '정원' | '덩굴'
  | '서양란' | '동양란' | '야생화' | '분재' | '이끼';

/**
 * 식물 관리 통계
 */
export interface PlantCareStats {
  waterCount: number;
  nutrientCount: number;
}

/**
 * 사용자 통계
 */
export interface UserStats {
  galleries: number;
  visitors: number;
  plants: number;
}

/**
 * 기본 User 인터페이스
 */
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  coverImage?: string;
  bio?: string;
  following: number;
  followers: number;
  posts: number;
  level: number;
  levelProgress: number;
  plantCare: PlantCareStats;
  interests: PlantInterest[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 목록에서 사용할 간소화된 User 타입
 */
export interface UserPreview {
  id: string;
  name: string;
  phone?: string;
  profileImage?: string;
  level: number;
  interests: PlantInterest[];
}

/**
 * 레거시 UserProfileData 타입과의 호환을 위한 타입
 */
export interface LegacyUserProfileData {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  coverImage: string;
  bio: string;
  following: number;
  followers: number;
  posts: number;
  level: number;
  levelProgress: number;
  plantCare: {
    waterCount: number;
    nutrientCount: number;
  };
  interests: string[];
}

/**
 * Prisma에서 사용할 User 생성 타입
 */
export interface UserCreateInput {
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  bio?: string;
  interests?: PlantInterest[];
}

/**
 * Prisma에서 사용할 User 수정 타입
 */
export interface UserUpdateInput {
  name?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  coverImage?: string;
  bio?: string;
  interests?: PlantInterest[];
}

/**
 * 레벨 경험치 요구사항
 */
export const LEVEL_EXP_REQUIREMENTS = {
  1: 100,
  2: 300,
  3: 600,
  4: 1000,
  5: 1500,
  6: 2100,
  7: 2800,
  8: 3600,
  9: 4500,
  10: 5500
} as const; 