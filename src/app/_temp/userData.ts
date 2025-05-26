import { LegacyUserProfileData } from '@/types/models/user';

export const userProfileData: LegacyUserProfileData[] = [
  {
    id: 'user_1',
    name: 'John Doe',
    email: 'john@example.com',
    profileImage: '/images/welcome-bg-01.webp',
    coverImage: '/images/welcome-bg-02.webp',
    bio: '식물을 사랑하는 사람입니다.',
    following: 120,
    followers: 84,
    posts: 24,
    level: 5,
    levelProgress: 75,
    plantCare: {
      waterCount: 3,
      nutrientCount: 2
    },
    interests: ["관엽", "다육", "허브", "공기정화", "식충"]
  },
  {
    id: 'user_2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    profileImage: '/images/welcome-bg-03.webp',
    coverImage: '/images/welcome-bg-04.webp',
    bio: '식물 초보자입니다. 많은 조언 부탁드려요!',
    following: 75,
    followers: 32,
    posts: 8,
    level: 3,
    levelProgress: 40,
    plantCare: {
      waterCount: 1,
      nutrientCount: 0
    },
    interests: ["관엽", "다육", "수경"]
  },
  {
    id: 'user_3',
    name: 'Sam Johnson',
    email: 'sam@example.com',
    profileImage: '/images/welcome-bg-01.webp',
    coverImage: '/images/welcome-bg-02.webp',
    bio: '다육식물 전문가입니다.',
    following: 250,
    followers: 310,
    posts: 56,
    level: 7,
    levelProgress: 60,
    plantCare: {
      waterCount: 5,
      nutrientCount: 3
    },
    interests: ["다육", "리톱스", "테라리움", "비바리움", "모종"]
  },
  {
    id: 'user_4',
    name: '김민수',
    email: 'minsu@example.com',
    profileImage: '/images/welcome-bg-03.webp',
    coverImage: '/images/welcome-bg-04.webp',
    bio: '식물과 함께하는 일상을 공유합니다',
    following: 180,
    followers: 120,
    posts: 42,
    level: 4,
    levelProgress: 90,
    plantCare: {
      waterCount: 2,
      nutrientCount: 1
    },
    interests: ["모종", "채소", "허브", "과일나무", "곡물"]
  },
  {
    id: 'user_5',
    name: '이지은',
    email: 'jieun@example.com',
    profileImage: '/images/welcome-bg-01.webp',
    coverImage: '/images/welcome-bg-02.webp',
    bio: '식물 인테리어 스타일리스트입니다',
    following: 320,
    followers: 450,
    posts: 78,
    level: 8,
    levelProgress: 25,
    plantCare: {
      waterCount: 4,
      nutrientCount: 3
    },
    interests: ["행잉", "테라리움", "관엽", "공기정화", "수경", "수생"]
  },
  {
    id: 'user_6',
    name: '박준호',
    email: 'junho@example.com',
    profileImage: '/images/welcome-bg-03.webp',
    coverImage: '/images/welcome-bg-04.webp',
    bio: '집에서 키우는 채소와 허브에 관심이 많아요',
    following: 95,
    followers: 67,
    posts: 29,
    level: 2,
    levelProgress: 65,
    plantCare: {
      waterCount: 1,
      nutrientCount: 1
    },
    interests: ["채소", "허브", "씨앗", "약용", "곡물"]
  },
  {
    id: 'user_7',
    name: '최유진',
    email: 'yujin@example.com',
    profileImage: '/images/welcome-bg-01.webp',
    coverImage: '/images/welcome-bg-02.webp',
    bio: '화분 컬렉터, 식물 사진 찍는 걸 좋아합니다',
    following: 210,
    followers: 185,
    posts: 63,
    level: 6,
    levelProgress: 50,
    plantCare: {
      waterCount: 3,
      nutrientCount: 2
    },
    interests: ["꽃나무", "화초", "관화", "정원", "덩굴"]
  },
  {
    id: 'user_8',
    name: '정승훈',
    email: 'seunghoon@example.com',
    profileImage: '/images/welcome-bg-03.webp',
    coverImage: '/images/welcome-bg-04.webp',
    bio: '식물 관련 책 저자, 식물 관리 팁 공유합니다',
    following: 420,
    followers: 980,
    posts: 112,
    level: 10,
    levelProgress: 80,
    plantCare: {
      waterCount: 6,
      nutrientCount: 4
    },
    interests: ["관엽", "관화", "서양란", "동양란", "야생화", "분재", "이끼"]
  }
]; 