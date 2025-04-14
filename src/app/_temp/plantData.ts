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
  },
  {
    id: 'plant_5',
    name: '몬스테라',
    image: '/images/welcome-bg-01.webp',
    isNew: true,
    description: '큰 잎이 매력적인 열대 식물이에요',
    category: '관엽수'
  },
  {
    id: 'plant_6',
    name: '산세베리아',
    image: '/images/welcome-bg-02.webp',
    isNew: false,
    description: '공기정화 능력이 뛰어나고 관리가 쉬워요',
    category: '다육식물'
  },
  {
    id: 'plant_7',
    name: '아이비',
    image: '/images/welcome-bg-03.webp',
    isNew: true,
    description: '덩굴식물로 인테리어 효과가 좋아요',
    category: '덩굴식물'
  },
  {
    id: 'plant_8',
    name: '피토니아',
    image: '/images/welcome-bg-04.webp',
    isNew: false,
    description: '잎의 무늬가 아름다운 실내 관상용 식물이에요',
    category: '관엽수'
  },
  {
    id: 'plant_9',
    name: '파키라',
    image: '/images/welcome-bg-01.webp',
    isNew: true,
    description: '행운을 가져다준다고 알려진 나무예요',
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
  },
  {
    id: 'mp_5',
    name: '몬스테라',
    image: '/images/welcome-bg-01.webp',
    isNew: false,
    status: true,
    waterStatus: true,
    nutrientStatus: true,
    waterAmount: 250,
    lastWateredDate: '2025-04-01',
    nextWateringDate: '2025-04-08',
    waterInterval: 7,
    lastNutrientDate: '2025-03-20',
    nextNutrientDate: '2025-04-20',
    nutrientInterval: 30,
    temperature: 24,
    humidity: 65,
    sunlight: 'indirect'
  },
  {
    id: 'mp_6',
    name: '산세베리아',
    image: '/images/welcome-bg-02.webp',
    isNew: true,
    status: true,
    waterStatus: false,
    nutrientStatus: true,
    waterAmount: 100,
    lastWateredDate: '2025-03-25',
    nextWateringDate: '2025-04-15',
    waterInterval: 20,
    lastNutrientDate: '2025-04-01',
    nextNutrientDate: '2025-05-01',
    nutrientInterval: 30,
    temperature: 22,
    humidity: 40,
    sunlight: 'bright'
  },
  {
    id: 'mp_7',
    name: '아이비',
    image: '/images/welcome-bg-03.webp',
    isNew: false,
    status: true,
    waterStatus: true,
    nutrientStatus: false,
    waterAmount: 150,
    lastWateredDate: '2025-04-05',
    nextWateringDate: '2025-04-12',
    waterInterval: 7,
    lastNutrientDate: '2025-03-10',
    nextNutrientDate: '2025-04-10',
    nutrientInterval: 30,
    temperature: 21,
    humidity: 55,
    sunlight: 'indirect'
  },
  {
    id: 'mp_8',
    name: '피토니아',
    image: '/images/welcome-bg-04.webp',
    isNew: true,
    status: false,
    waterStatus: false,
    nutrientStatus: false,
    waterAmount: 180,
    lastWateredDate: '2025-03-30',
    nextWateringDate: '2025-04-06',
    waterInterval: 7,
    lastNutrientDate: '2025-03-15',
    nextNutrientDate: '2025-04-15',
    nutrientInterval: 30,
    temperature: 23,
    humidity: 70,
    sunlight: 'filtered'
  },
  {
    id: 'mp_9',
    name: '파키라',
    image: '/images/welcome-bg-01.webp',
    isNew: false,
    status: true,
    waterStatus: true,
    nutrientStatus: true,
    waterAmount: 200,
    lastWateredDate: '2025-04-02',
    nextWateringDate: '2025-04-09',
    waterInterval: 7,
    lastNutrientDate: '2025-04-01',
    nextNutrientDate: '2025-05-01',
    nutrientInterval: 30,
    temperature: 22,
    humidity: 50,
    sunlight: 'bright'
  }
]; 