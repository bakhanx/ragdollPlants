export const plantItems = [
  {
    id: "plant_1",
    name: "Cactus",
    image: "/images/welcome-bg-01.webp",
    isNew: true,
    description: "선인장은 건조한 환경에서도 잘 자라요",
    category: "succulent"
  },
  {
    id: "plant_2",
    name: "Cactus Red",
    image: "/images/welcome-bg-02.webp",
    isNew: false,
    description: "빨간 선인장은 햇빛이 잘 드는 곳을 좋아해요",
    category: "succulent"
  },
  {
    id: "plant_3",
    name: "Unknown Plant",
    image: "/images/welcome-bg-03.webp",
    isNew: false,
    description: "아직 이름을 모르는 신비한 식물이에요",
    category: "unknown"
  },
];
export const myPlants = [
  {
    id: "mp_1",
    name: "Cactus",
    image: "/images/welcome-bg-01.webp",
    isNew: true,
    status: true,
    waterAmount: 150,
    lastWateredDate: "2024-03-20",
    nextWateringDate: "2024-03-27",
    temperature: 22,
    humidity: 45,
    sunlight: "bright"
  },
  {
    id: "mp_2",
    name: "Cactus Red",
    image: "/images/welcome-bg-02.webp",
    isNew: false,
    status: true,
    waterAmount: 120,
    lastWateredDate: "2024-03-19",
    nextWateringDate: "2024-03-26",
    temperature: 23,
    humidity: 40,
    sunlight: "direct"
  },
  {
    id: "mp_3",
    name: "Unknown Plant",
    image: "/images/welcome-bg-03.webp",
    isNew: false,
    status: false,
    waterAmount: 200,
    lastWateredDate: "2024-03-18",
    nextWateringDate: "2024-03-25",
    temperature: 20,
    humidity: 60,
    sunlight: "indirect"
  },
  {
    id: "mp_4",
    name: "선인장",
    image: "/images/welcome-bg-04.webp",
    isNew: true,
    status: false,
    waterAmount: 100,
    lastWateredDate: "2024-03-17",
    nextWateringDate: "2024-03-24",
    temperature: 21,
    humidity: 50,
    sunlight: "bright"
  },
];

export const userProfileData = {
  id: "user_1",
  nickname: "초록이의 정원",
  level: 5,
  stats: {
    followers: 27,
    visitors: 12,
    plants: 30,
    totalWatering: 150,
    completedCare: 45
  },
  levelProgress: 75,
  plantCare: {
    waterCount: 3,
    nutrientCount: 2,
    lastActive: "2024-03-20"
  },
  badges: ["plant_master", "water_expert", "new_gardener"]
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
  10: 5500,
} as const;

export const profileImg = "/images/Profile.png";
