import type { Plant, Diary, Gallery, User } from '@prisma/client';
import type { UserProfileData } from '@/app/actions/userProfile';

export type DemoPlant = Plant & {
  likes: number;
  isLiked: boolean;
  author: Pick<User, 'id' | 'name' | 'image'>;
};

export type DemoDiary = Diary & {
  likes: number;
  isLiked: boolean;
  author: Pick<User, 'id' | 'name' | 'image'>;
  plant: {
    id: string;
    name: string;
  } | null;
};

export type DemoGallery = Gallery & {
  likes: number;
  author: Pick<User, 'id' | 'name' | 'image'>;
  plant: {
    id: string;
    name: string;
  } | null;
};

// 데모 사용자 프로필은 UserProfileData 타입 사용
export type DemoUserProfile = UserProfileData;

// 케어 커스텀 별도 정의
export interface DemoCare {
  id: string;
  name: string;
  image: string;
  isNew: boolean;
  status: boolean;
  waterStatus: boolean;
  nutrientStatus: boolean;
  waterAmount: number;
  lastWateredDate: string;
  nextWateringDate: string;
  waterInterval: number;
  lastNutrientDate: string;
  nextNutrientDate: string;
  nutrientInterval: number;
  temperature: number;
  humidity: number;
  sunlight: string;
}

// Pagination 타입 정의
export interface DemoPagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// 공통 사용자 정보
const DEMO_USER = {
  id: 'demo-user',
  name: '게스트',
  image: '/images/Profile.webp'
};

// 기본 pagination 설정
const DEMO_PAGINATION: DemoPagination = {
  currentPage: 1,
  totalPages: 1,
  totalCount: 2,
  limit: 4,
  hasNextPage: false,
  hasPreviousPage: false
};

// 데모 식물 데이터
const DEMO_PLANTS_DATA: DemoPlant[] = [
  {
    id: 'demo-plant-1',
    name: '내 첫 몬스테라',
    image: '/images/monstera01.webp',
    category: '몬스테라',
    description: '처음 키우는 몬스테라예요. 잎이 점점 커지고 있어서 뿌듯해요!',
    location: '거실 창가',
    purchaseDate: new Date('2024-01-15'),
    wateringInterval: 7,
    nutrientInterval: 30,
    lastWateredDate: new Date('2024-01-20'),
    nextWateringDate: new Date('2024-01-27'),
    lastNutrientDate: new Date('2024-01-15'),
    nextNutrientDate: new Date('2024-02-15'),
    temperature: 22.0,
    humidity: 55.0,
    sunlight: 'bright',
    isPublic: true,
    isActive: true,
    needsWater: true,
    needsNutrient: false,
    tags: ['몬스테라', '초보', '실내식물'],
    reportCount: 0,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    authorId: 'demo-user',
    // 추가 필드
    likes: 5,
    isLiked: false,
    author: DEMO_USER
  },
  {
    id: 'demo-plant-2',
    name: '귀여운 스킨답서스',
    image: '/images/scindapsus01.webp',
    category: '스킨답서스',
    description: '물꽂이로 뿌리를 내린 후 화분에 옮겨 심었어요.',
    location: '침실',
    purchaseDate: new Date('2024-01-10'),
    wateringInterval: 7,
    nutrientInterval: 15,
    lastWateredDate: new Date('2024-01-22'),
    nextWateringDate: new Date('2024-01-29'),
    lastNutrientDate: new Date('2024-01-10'),
    nextNutrientDate: new Date('2024-01-25'),
    temperature: 20.0,
    humidity: 60.0,
    sunlight: 'medium',
    isPublic: true,
    isActive: true,
    needsWater: false,
    needsNutrient: true,
    tags: ['스킨답서스', '물꽂이', '뿌리'],
    reportCount: 0,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-22'),
    authorId: 'demo-user',
    // 추가 필드
    likes: 3,
    isLiked: false,
    author: DEMO_USER
  }
];

// 데모 다이어리 데이터
const DEMO_DIARIES_DATA: DemoDiary[] = [
  {
    id: 'demo-diary-1',
    title: '몬스테라 새 잎이 나왔어요!',
    content:
      '오늘 몬스테라에서 새로운 잎이 나오는 걸 발견했어요. 정말 신기하고 뿌듯합니다. 처음에는 작은 새싹 같았는데 점점 커지고 있어요.',
    date: new Date('2024-01-20'),
    image: '/images/monstera02.webp',
    status: 'good',
    tags: ['새잎', '성장', '기쁨'],
    isPublic: true,
    isActive: true,
    reportCount: 0,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    plantId: 'demo-plant-1',
    authorId: 'demo-user',
    // 추가 필드
    likes: 8,
    isLiked: false,
    author: DEMO_USER,
    plant: {
      id: 'demo-plant-1',
      name: '내 첫 몬스테라'
    }
  },
  {
    id: 'demo-diary-2',
    title: '스킨답서스 물꽂이 성공!',
    content:
      '스킨답서스 가지를 물에 꽂아둔 지 2주 만에 뿌리가 나왔어요. 이제 화분에 옮겨 심어야겠어요.',
    date: new Date('2024-01-18'),
    image: '/images/scindapsus02.webp',
    status: 'good',
    tags: ['물꽂이', '뿌리', '성공'],
    isPublic: true,
    isActive: true,
    reportCount: 0,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    plantId: 'demo-plant-2',
    authorId: 'demo-user',
    // 추가 필드
    likes: 6,
    isLiked: false,
    author: DEMO_USER,
    plant: {
      id: 'demo-plant-2',
      name: '귀여운 스킨답서스'
    }
  }
];

// 데모 갤러리 데이터
const DEMO_GALLERIES_DATA: DemoGallery[] = [
  {
    id: 'demo-gallery-1',
    title: '울집 앞마당 수국',
    image: '/images/hydrangea01.webp',
    description: '우리집 앞마당 수국이 이렇게 예쁘게 폈어요!',
    tags: ['수국', '실내식물', '초보'],
    isPublic: true,
    isActive: true,
    displayOrder: 0,
    isFeatured: true,
    reportCount: 0,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    plantId: 'demo-plant-1',
    authorId: 'demo-user',
    // 추가 필드
    likes: 12,
    author: DEMO_USER,
    plant: {
      id: 'demo-plant-1',
      name: '내 앞마당 수국'
    }
  },
  {
    id: 'demo-gallery-2',
    title: '분홍 연꽃',
    image: '/images/lotus01.webp',
    description: '물위에 떠오른 분홍 연꽃',
    tags: ['수생식물', '햇살', '아침'],
    isPublic: true,
    isActive: true,
    displayOrder: 1,
    isFeatured: false,
    reportCount: 0,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    plantId: 'demo-plant-2',
    authorId: 'demo-user',
    // 추가 필드
    likes: 8,
    author: DEMO_USER,
    plant: {
      id: 'demo-plant-2',
      name: '분홍 연꽃'
    }
  },
  {
    id: 'demo-gallery-3',
    title: '거실 관엽 식물들',
    image: '/images/greenplants01.webp',
    description: '푸릇푸릇한 이쁜 관엽 식물들',
    tags: ['관엽', '햇살', '아침'],
    isPublic: true,
    isActive: true,
    displayOrder: 1,
    isFeatured: false,
    reportCount: 0,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    plantId: 'demo-plant-3',
    authorId: 'demo-user',
    // 추가 필드
    likes: 8,
    author: DEMO_USER,
    plant: {
      id: 'demo-plant-3',
      name: '푸릇푸릇 관엽 식물'
    }
  },
  {
    id: 'demo-gallery-4',
    title: '선인장 외 다육이들',
    image: '/images/cactus01.webp',
    description: '아침 햇살을 받으며 반짝이는 선인장들',
    tags: ['선인장', '햇살', '아침'],
    isPublic: true,
    isActive: true,
    displayOrder: 1,
    isFeatured: false,
    reportCount: 0,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    plantId: 'demo-plant-2',
    authorId: 'demo-user',
    // 추가 필드
    likes: 8,
    author: DEMO_USER,
    plant: {
      id: 'demo-plant-4',
      name: '반짝이느 선인장들'
    }
  }
];

// 데모 케어 데이터
const DEMO_CARE_DATA: DemoCare[] = [
  {
    id: 'demo-plant-1',
    name: '내 첫 몬스테라',
    image: '/images/monstera01.webp',
    isNew: false,
    status: true,
    waterStatus: true,
    nutrientStatus: false,
    waterAmount: 150,
    lastWateredDate: '2024-01-20',
    nextWateringDate: '2024-01-27',
    waterInterval: 7,
    lastNutrientDate: '2024-01-15',
    nextNutrientDate: '2024-02-15',
    nutrientInterval: 30,
    temperature: 22,
    humidity: 55,
    sunlight: 'bright'
  },
  {
    id: 'demo-plant-2',
    name: '귀여운 스킨답서스',
    image: '/images/scindapsus01.webp',
    isNew: false,
    status: true,
    waterStatus: false,
    nutrientStatus: true,
    waterAmount: 100,
    lastWateredDate: '2024-01-22',
    nextWateringDate: '2024-01-29',
    waterInterval: 7,
    lastNutrientDate: '2024-01-10',
    nextNutrientDate: '2024-01-25',
    nutrientInterval: 15,
    temperature: 20,
    humidity: 60,
    sunlight: 'medium'
  }
];
//

// 데모 사용자 프로필 데이터
export const DEMO_USER_PROFILE: DemoUserProfile = {
  id: 'demo-user',
  loginId: 'demo-user',
  name: '게스트',
  email: null,
  image: '/images/Profile.webp',
  bio: '식물을 처음 키우기 시작한 초보입니다. 몬스테라와 스킨답서스를 키우고 있어요!',
  isProfilePublic: true,
  level: 2,
  levelProgress: 45,
  waterCount: 15,
  nutrientCount: 8,
  interests: ['실내식물', '초보가이드', '몬스테라'],
  _count: {
    plants: 2,
    followersList: 12,
    galleries: 2
  },
  todayWaterCount: 1,
  todayNutrientCount: 0
};

// Export 데이터
export const DEMO_PLANTS = DEMO_PLANTS_DATA;
export const DEMO_DIARIES = DEMO_DIARIES_DATA;
export const DEMO_GALLERIES = DEMO_GALLERIES_DATA;
export const DEMO_CARE = DEMO_CARE_DATA;

// Response 형태 export
export const DEMO_PLANTS_RESPONSE = {
  plants: DEMO_PLANTS_DATA,
  pagination: DEMO_PAGINATION
};

export const DEMO_DIARIES_RESPONSE = {
  diaries: DEMO_DIARIES_DATA,
  pagination: DEMO_PAGINATION
};

export const DEMO_GALLERIES_RESPONSE = {
  galleries: DEMO_GALLERIES_DATA,
  isOwner: false // 데모 데이터는 편집 불가
};
export const DEMO_CARE_RESPONSE = DEMO_CARE_DATA;
