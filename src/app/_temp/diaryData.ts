export type DiaryPost = {
  id: string;
  title: string;
  content: string;
  date: string;
  imageUrl: string;
};

export const diaryPosts: DiaryPost[] = [
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
      '봄을 맞이하여 다육이들 분갈이를 했습니다. 새로운 흙과 예쁜 화분으로 갈아주니 더 건강해 보이네요.',
    date: '2024.04.05',
    imageUrl: '/images/welcome-bg-03.webp'
  },
  {
    id: 'post3',
    title: '베란다 정원 만들기',
    content:
      '작은 베란다지만 나만의 정원을 만들어보았어요. 허브와 작은 채소들을 심어 가꾸고 있답니다.',
    date: '2024.04.03',
    imageUrl: '/images/welcome-bg-02.webp'
  },
  {
    id: 'post4',
    title: '선인장 꽃이 피었어요',
    content:
      '3년 동안 키운 선인장에 드디어 꽃이 피었습니다! 꽃이 피기 전날 약간의 물만 주고 햇빛이 잘 드는 곳에 두었더니 다음 날 아침에 작은 노란 꽃이 피어있었어요.',
    date: '2024.04.01',
    imageUrl: '/images/welcome-bg-01.webp'
  },
  {
    id: 'post5',
    title: '식물 성장 기록',
    content:
      '한 달 전 구매한 아이비가 벌써 이렇게 자랐어요. 매주 사진을 찍어서 기록하고 있는데, 성장 속도가 놀랍습니다. 잎도 더 진한 녹색으로 변했어요.',
    date: '2024.03.29',
    imageUrl: '/images/welcome-bg-02.webp'
  },
  {
    id: 'post6',
    title: '새로 산 공기정화 식물',
    content:
      '오늘 화원에서 공기정화 효과가 좋다는 산세베리아를 구매했어요. 거실 한쪽에 두었는데 인테리어 효과도 좋고, 공기도 맑아진 것 같아요.',
    date: '2024.03.27',
    imageUrl: '/images/welcome-bg-03.webp'
  },
  {
    id: 'post7',
    title: '다육이 물주기 일지',
    content:
      '다육이에 물을 너무 자주 줬더니 뿌리가 썩기 시작했어요. 급하게 화분에서 꺼내 건조시키고 새 흙으로 갈아줬더니 살아났습니다. 다육이는 정말 물을 적게 주는 게 좋네요.',
    date: '2024.03.25',
    imageUrl: '/images/welcome-bg-04.webp'
  },
  {
    id: 'post8',
    title: '식물 빛 관리',
    content:
      '피토니아가 창가에서 햇빛을 너무 많이 받아 잎이 탔어요. 그늘진 곳으로 옮기고 물을 충분히 주니 다시 건강해지기 시작했습니다. 식물마다 빛 요구량이 다르다는 걸 배웠어요.',
    date: '2024.03.22',
    imageUrl: '/images/welcome-bg-01.webp'
  }
]; 