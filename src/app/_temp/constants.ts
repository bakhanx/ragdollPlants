export const plantItems = [
  {
    id: 'plant_1',
    name: 'Cactus',
    image: '/images/welcome-bg-01.webp',
    isNew: true,
    description: '선인장은 건조한 환경에서도 잘 자라요',
    category: 'succulent'
  },
  {
    id: 'plant_2',
    name: 'Cactus Red',
    image: '/images/welcome-bg-02.webp',
    isNew: false,
    description: '빨간 선인장은 햇빛이 잘 드는 곳을 좋아해요',
    category: 'succulent'
  },
  {
    id: 'plant_3',
    name: 'Unknown Plant',
    image: '/images/welcome-bg-03.webp',
    isNew: false,
    description: '아직 이름을 모르는 신비한 식물이에요',
    category: 'unknown'
  },
  {
    id: 'plant_4',
    name: '테이블 야자',
    image: '/images/welcome-bg-04.webp',
    isNew: true,
    description: '아프리카 테이블 야자',
    category: '관엽수'
  }
];
export const myPlants = [
  {
    id: 'mp_1',
    name: 'Cactus',
    image: '/images/welcome-bg-01.webp',
    isNew: true,
    status: true,
    waterStatus: true,
    nutrientStatus: false,
    waterAmount: 150,
    lastWateredDate: '2025-04-08',
    nextWateringDate: '2025-04-10',
    waterInterval: 3, // 1주일마다 물주기
    lastNutrientDate: '2025-03-12',
    nextNutrientDate: '2025-04-12',
    nutrientInterval: 10, // 30일마다 비료주기
    temperature: 22,
    humidity: 45,
    sunlight: 'bright'
  },
  {
    id: 'mp_2',
    name: 'Cactus Red',
    image: '/images/welcome-bg-02.webp',
    isNew: false,
    status: true,
    waterStatus: true,
    nutrientStatus: true,
    waterAmount: 120,
    lastWateredDate: '2025-03-19',
    nextWateringDate: '2025-04-20',
    waterInterval: 7, // 1주일마다 물주기
    lastNutrientDate: '2025-03-15',
    nextNutrientDate: '2025-04-15',
    nutrientInterval: 7, // 30일마다 비료주기
    temperature: 23,
    humidity: 40,
    sunlight: 'direct'
  },
  {
    id: 'mp_3',
    name: 'Unknown Plant',
    image: '/images/welcome-bg-03.webp',
    isNew: false,
    status: false,
    waterStatus: false,
    nutrientStatus: false,
    waterAmount: 200,
    lastWateredDate: '2025-03-18',
    nextWateringDate: '2025-04-30',
    waterInterval: 5, // 1주일마다 물주기
    lastNutrientDate: '2025-04-01',
    nextNutrientDate: '2025-04-30',
    nutrientInterval: 30, // 30일마다 비료주기
    temperature: 20,
    humidity: 60,
    sunlight: 'indirect'
  },
  {
    id: 'mp_4',
    name: '선인장',
    image: '/images/welcome-bg-04.webp',
    isNew: true,
    status: false,
    waterStatus: false,
    nutrientStatus: false,
    waterAmount: 100,
    lastWateredDate: '2025-03-23',
    nextWateringDate: '2025-03-30',
    waterInterval: 7, // 1주일마다 물주기
    lastNutrientDate: '2025-04-09',
    nextNutrientDate: '2025-05-09',
    nutrientInterval: 30, // 30일마다 비료주기
    temperature: 21,
    humidity: 50,
    sunlight: 'bright'
  }
];

export const userProfileData = {
  id: 'user_1',
  nickname: '초록이',
  level: 5,
  stats: {
    galleries: 27,
    visitors: 12,
    plants: 30,
    totalWatering: 150,
    completedCare: 45
  },
  levelProgress: 75,
  plantCare: {
    waterCount: 3,
    nutrientCount: 2,
    lastActive: '2024-03-20'
  },
  badges: ['plant_master', 'water_expert', 'new_gardener']
} as const;

export const levelExpRequirements = {
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

export const profileImg = '/images/Profile.png';

export type DiaryPost = {
  id: string;
  title: string;
  content: string;
  date: string;
  imageUrl: string;
};

export const diaryPosts = [
  {
    id: 'post1',
    title: '몬스테라 일지 02',
    content:
      '오늘 아침에 일어나보니 몬스테라에서 새로운 잎이 나오고 있었어요. 2주 전부터 뿌리가 나오기 시작했는데, 드디어 새 잎이 나왔네요.',
    date: '2024.04.07',
    imageUrl: '/images/welcome-bg-04.webp'
  },
  {
    id: 'post2',
    title: '몬스테라 일지 01',
    content:
      '봄을 맞이하여 다육이들 분갈이를 했습니다. 새로운 흙과 예쁜 화분으로 갈아주니 더 건강해 보이네요.봄을 맞이하여 다육이들 분갈이를 했습니다. 새로운 흙과 예쁜 화분으로 갈아주니 더 건강해 보이네요.봄을 맞이하여 다육이들 분갈이를 했습니다. 새로운 흙과 예쁜 화분으로 갈아주니 더 건강해 보이네요.봄을 맞이하여 다육이들 분갈이를 했습니다. 새로운 흙과 예쁜 화분으로 갈아주니 더 건강해 보이네요.봄을 맞이하여 다육이들 분갈이를 했습니다. 새로운 흙과 예쁜 화분으로 갈아주니 더 건강해 보이네요.',
    date: '2024.04.05',
    imageUrl: '/images/welcome-bg-03.webp'
  },
  {
    id: 'post3',
    title: '베란다 정원 만들기',
    content:
      '작은 베란다지만 나만의 정원을 만들어보았어요. 허브와 작은 채소들을 심어 가꾸고 있답니다.작은 베란다지만 나만의 정원을 만들어보았어요. 허브와 작은 채소들을 심어 가꾸고 있답니다.작은 베란다지만 나만의 정원을 만들어보았어요. 허브와 작은 채소들을 심어 가꾸고 있답니다.작은 베란다지만 나만의 정원을 만들어보았어요. 허브와 작은 채소들을 심어 가꾸고 있답니다.',
    date: '2024.04.03',
    imageUrl: '/images/welcome-bg-02.webp'
  }
] as const;

export const articleItems = [
  {
    id: 'article_1',
    title: '🌿 겨울을 지나온 식물 점검하기',
    image: '/images/welcome-bg-01.webp',
    date: '2024.04.07'
  },
  {
    id: 'article_2',
    title: '🎍분갈이: 지금이 적기',
    image: '/images/welcome-bg-02.webp',
    date: '2024.04.05'
  },
  {
    id: 'article_3',
    title: '💧 물주기: 계절 전환 체크 포인트',
    image: '/images/welcome-bg-03.webp',
    date: '2024.04.05'
  },
  {
    id: 'article_4',
    title: '[Tip] ☀️ 빛과 위치: 무조건 밝은 데가 답은 아닙니다.',
    image: '/images/welcome-bg-04.webp',
    date: '2024.04.05'
  }
];

export type NotificationType = {
  id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  type: 'water' | 'nutrient' | 'article';
  plantId?: string;
  articleId?: string;
};

export const notifications: NotificationType[] = [
  {
    id: 'notif_1',
    title: '물주기 알림',
    message: '몬스테라에 물을 줄 시간이에요!',
    date: '2024.04.15',
    isRead: false,
    type: 'water',
    plantId: 'mp_1'
  },
  {
    id: 'notif_2',
    title: '영양분 알림',
    message: '선인장에 영양분을 공급할 시간입니다.',
    date: '2024.04.14',
    isRead: false,
    type: 'nutrient',
    plantId: 'mp_2'
  },
  {
    id: 'notif_3',
    title: '새 아티클 발행',
    message: '여름철 식물 관리 비법을 확인해보세요.',
    date: '2024.04.10',
    isRead: true,
    type: 'article',
    articleId: 'article_1'
  }
];
