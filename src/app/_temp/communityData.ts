export const communityPosts = [
  {
    id: 'post_1',
    userId: 'user_1',
    userName: 'John Doe',
    userProfileImage: '/images/welcome-bg-01.webp',
    title: '내 몬스테라가 새 잎을 냈어요!',
    content: '한 달 동안 정성껏 돌봤더니 드디어 새 잎이 나왔습니다. 너무 기쁩니다!',
    images: ['/images/welcome-bg-02.webp', '/images/welcome-bg-03.webp'],
    likes: 45,
    comments: 12,
    date: '2023-04-15',
    tags: ['몬스테라', '식물성장', '식물케어']
  },
  {
    id: 'post_2',
    userId: 'user_2',
    userName: 'Jane Smith',
    userProfileImage: '/images/welcome-bg-03.webp',
    title: '식물 초보자를 위한 팁 공유',
    content: '식물을 키우기 시작한 지 6개월 차입니다. 제가 알게 된 좋은 팁들을 공유합니다!',
    images: ['/images/welcome-bg-04.webp'],
    likes: 78,
    comments: 23,
    date: '2023-04-10',
    tags: ['초보자팁', '식물케어', '가이드']
  },
  {
    id: 'post_3',
    userId: 'user_3',
    userName: 'Sam Johnson',
    userProfileImage: '/images/welcome-bg-01.webp',
    title: '다육식물 번식 방법',
    content: '제가 성공적으로 다육식물을 번식시킨 방법을 알려드립니다. 잎꽂이와 줄기꽂이 방법 모두 설명해 드릴게요.',
    images: ['/images/welcome-bg-02.webp', '/images/welcome-bg-03.webp', '/images/welcome-bg-04.webp'],
    likes: 112,
    comments: 34,
    date: '2023-04-05',
    tags: ['다육식물', '번식', '잎꽂이', '줄기꽂이']
  },
  {
    id: 'post_4',
    userId: 'user_4',
    userName: '김민수',
    userProfileImage: '/images/welcome-bg-03.webp',
    title: '식물 정리한 내 거실',
    content: '주말에 거실 식물들을 정리했어요. 햇빛이 잘 들어오는 창가에 배치하니 더 예쁘네요!',
    images: ['/images/welcome-bg-04.webp', '/images/welcome-bg-01.webp'],
    likes: 67,
    comments: 15,
    date: '2023-04-02',
    tags: ['인테리어', '식물배치', '거실']
  },
  {
    id: 'post_5',
    userId: 'user_5',
    userName: '이지은',
    userProfileImage: '/images/welcome-bg-01.webp',
    title: '식물 인테리어 스타일링 방법',
    content: '공간에 따른 식물 배치와 화분 선택 방법에 대해 알려드립니다. 식물로 집 분위기를 바꿔보세요!',
    images: ['/images/welcome-bg-02.webp', '/images/welcome-bg-03.webp'],
    likes: 156,
    comments: 42,
    date: '2023-03-28',
    tags: ['인테리어', '스타일링', '화분', '공간활용']
  },
  {
    id: 'post_6',
    userId: 'user_6',
    userName: '박준호',
    userProfileImage: '/images/welcome-bg-03.webp',
    title: '베란다에서 키우는 바질과 민트',
    content: '작은 베란다에서도 허브를 키울 수 있어요! 바질과 민트 재배 노하우를 공유합니다.',
    images: ['/images/welcome-bg-04.webp'],
    likes: 89,
    comments: 27,
    date: '2023-03-25',
    tags: ['허브', '바질', '민트', '베란다가드닝']
  },
  {
    id: 'post_7',
    userId: 'user_7',
    userName: '최유진',
    userProfileImage: '/images/welcome-bg-01.webp',
    title: '새로 산 화분 컬렉션',
    content: '이번 주에 새로 구매한 화분들이에요. 디자인별로 다양하게 모았습니다!',
    images: ['/images/welcome-bg-02.webp', '/images/welcome-bg-03.webp', '/images/welcome-bg-04.webp'],
    likes: 103,
    comments: 31,
    date: '2023-03-20',
    tags: ['화분', '컬렉션', '식물소품']
  },
  {
    id: 'post_8',
    userId: 'user_8',
    userName: '정승훈',
    userProfileImage: '/images/welcome-bg-03.webp',
    title: '식물 월동 준비하는 방법',
    content: '겨울이 다가오고 있습니다. 식물들이 추운 겨울을 잘 날 수 있도록 준비하는 방법을 알려드려요.',
    images: ['/images/welcome-bg-04.webp', '/images/welcome-bg-01.webp'],
    likes: 178,
    comments: 54,
    date: '2023-03-15',
    tags: ['월동', '겨울관리', '온도관리', '식물케어']
  }
];

export const communityComments = [
  {
    id: 'comment_1',
    postId: 'post_1',
    userId: 'user_2',
    userName: 'Jane Smith',
    userProfileImage: '/images/welcome-bg-03.webp',
    content: '와! 정말 멋지네요. 저도 몬스테라를 키우고 있는데 어떤 관리법을 사용하셨나요?',
    likes: 8,
    date: '2023-04-15'
  },
  {
    id: 'comment_2',
    postId: 'post_1',
    userId: 'user_3',
    userName: 'Sam Johnson',
    userProfileImage: '/images/welcome-bg-01.webp',
    content: '새 잎이 정말 건강해 보입니다! 축하드려요!',
    likes: 5,
    date: '2023-04-15'
  },
  {
    id: 'comment_3',
    postId: 'post_2',
    userId: 'user_1',
    userName: 'John Doe',
    userProfileImage: '/images/welcome-bg-01.webp',
    content: '좋은 정보 감사합니다. 특히 물주기 팁이 유용했어요.',
    likes: 12,
    date: '2023-04-11'
  },
  {
    id: 'comment_4',
    postId: 'post_2',
    userId: 'user_4',
    userName: '김민수',
    userProfileImage: '/images/welcome-bg-03.webp',
    content: '초보자로서 많은 도움이 됐습니다. 다음 글도 기대할게요!',
    likes: 7,
    date: '2023-04-12'
  },
  {
    id: 'comment_5',
    postId: 'post_3',
    userId: 'user_5',
    userName: '이지은',
    userProfileImage: '/images/welcome-bg-01.webp',
    content: '잎꽂이 방법을 따라해봤는데 잘 되고 있어요! 감사합니다.',
    likes: 15,
    date: '2023-04-06'
  },
  {
    id: 'comment_6',
    postId: 'post_3',
    userId: 'user_2',
    userName: 'Jane Smith',
    userProfileImage: '/images/welcome-bg-03.webp',
    content: '다육식물 종류에 따라 번식 방법이 다른가요?',
    likes: 3,
    date: '2023-04-07'
  },
  {
    id: 'comment_7',
    postId: 'post_4',
    userId: 'user_6',
    userName: '박준호',
    userProfileImage: '/images/welcome-bg-03.webp',
    content: '거실이 정말 예쁘네요! 어떤 식물들을 키우고 계신가요?',
    likes: 6,
    date: '2023-04-03'
  },
  {
    id: 'comment_8',
    postId: 'post_5',
    userId: 'user_7',
    userName: '최유진',
    userProfileImage: '/images/welcome-bg-01.webp',
    content: '스타일링 팁 정말 도움 됩니다. 화분 고르는 방법도 알려주세요!',
    likes: 9,
    date: '2023-03-29'
  },
  {
    id: 'comment_9',
    postId: 'post_6',
    userId: 'user_8',
    userName: '정승훈',
    userProfileImage: '/images/welcome-bg-03.webp',
    content: '베란다 허브 정원 만들기에 도전해보고 싶어졌어요. 추천하는 허브 조합이 있을까요?',
    likes: 11,
    date: '2023-03-26'
  },
  {
    id: 'comment_10',
    postId: 'post_7',
    userId: 'user_1',
    userName: 'John Doe',
    userProfileImage: '/images/welcome-bg-01.webp',
    content: '화분 컬렉션이 멋지네요! 어디서 구매하셨나요?',
    likes: 8,
    date: '2023-03-21'
  },
  {
    id: 'comment_11',
    postId: 'post_8',
    userId: 'user_5',
    userName: '이지은',
    userProfileImage: '/images/welcome-bg-01.webp',
    content: '실내 온도 유지에 대한 팁이 특히 유용했습니다. 감사합니다!',
    likes: 14,
    date: '2023-03-16'
  },
  {
    id: 'comment_12',
    postId: 'post_8',
    userId: 'user_3',
    userName: 'Sam Johnson',
    userProfileImage: '/images/welcome-bg-01.webp',
    content: '다육식물도 같은 방법으로 월동 준비를 해야 할까요?',
    likes: 5,
    date: '2023-03-17'
  }
]; 