export const plantItems = [
  {
    name: "Cactus",
    image: "/images/welcome-bg-01.webp",
    isNew: true,
  },
  {
    name: "Cactus Red",
    image: "/images/welcome-bg-02.webp",
    isNew: false,
  },
  {
    name: "Unknown Plant",
    image: "/images/welcome-bg-03.webp",
    isNew: false,
  },
  // {
  //   name: "선인장",
  //   image: "/images/welcome-bg-04.webp",
  //   isNew: true,
  // },
];
export const myPlants = [
  {
    name: "Cactus",
    image: "/images/welcome-bg-01.webp",
    isNew: true,
    status: true
  },
  {
    name: "Cactus Red",
    image: "/images/welcome-bg-02.webp",
    isNew: false,
    status: true
  },
  {
    name: "Unknown Plant",
    image: "/images/welcome-bg-03.webp",
    isNew: false,
    status: false
  },
  {
    name: "선인장",
    image: "/images/welcome-bg-04.webp",
    isNew: true,
    status: false,
  },
  {
    name: "Cactus",
    image: "/images/welcome-bg-01.webp",
    isNew: true,
    status: true
  },
  {
    name: "Cactus Red",
    image: "/images/welcome-bg-02.webp",
    isNew: false,
    status: true
  },
  {
    name: "Unknown Plant",
    image: "/images/welcome-bg-03.webp",
    isNew: false,
    status: false
  },
  {
    name: "선인장",
    image: "/images/welcome-bg-04.webp",
    isNew: true,
    status: false,
  },
];

export const userProfileData = {
  nickname: "초록이의 정원",
  level: 5,
  stats: {
    followers: 27,
    visitors: 12,
    plants: 30
  },
  levelProgress: 75,
  plantCare: {
    todayWaterCount: 3,
    weeklyNutrientCount: 2
  }
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
