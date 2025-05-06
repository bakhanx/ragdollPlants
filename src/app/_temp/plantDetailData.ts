// 식물 상세 임시 데이터
export const plantDetails = {
  id: 1,
  name: '몬스테라',
  imageUrl: '/images/welcome-bg-01.webp',
  plantType: '실내식물',
  location: '거실 창가',
  acquiredDate: '2023-01-15',
  lastWatered: '2023-04-10',
  wateringCycle: 7, // 일 단위
  lastFertilized: '2023-03-20',
  fertilizerCycle: 30, // 일 단위
  notes: '습도가 높은 환경을 좋아하며, 직사광선은 피하는 것이 좋습니다.',
  needsWater: true,
  needsNutrient: false
};

// 최근 다이어리 데이터
export const recentDiaries = [
  {
    id: 101,
    date: '2023-04-18',
    title: '새 잎이 돋아났어요',
    hasImage: true,
    excerpt:
      '오늘 아침에 확인해보니 새 잎이 나오기 시작했어요. 생각보다 빠르게 자라서 놀랐습니다...'
  },
  {
    id: 102,
    date: '2023-04-15',
    title: '물주기 & 분무',
    hasImage: true,
    excerpt:
      '일주일만에 물을 주고 잎에 분무도 해줬어요. 건조한 날씨 때문에 잎이 조금 말라보여서...'
  },
  {
    id: 103,
    date: '2023-04-10',
    title: '위치 변경',
    hasImage: false,
    excerpt:
      '햇빛이 잘 들어오는 창가로 위치를 옮겼어요. 몬스테라가 더 건강하게 자랐으면 좋겠습니다...'
  }
]; 