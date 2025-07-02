// 분리된 모든 데이터 파일을 내보내는 인덱스 파일

// 식물 관련 데이터
export * from './plantData';

// 사용자 관련 데이터
export * from './userData';

// 커뮤니티 관련 데이터
export * from './communityData';

// 다이어리 관련 데이터
export * from './diaryData';

// 알림 유형 정의
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

// 알림 데이터
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
  },
  {
    id: 'notif_4',
    title: '물주기 알림',
    message: '아이비에 물을 줄 시간이에요!',
    date: '2024.04.12',
    isRead: false,
    type: 'water',
    plantId: 'mp_7'
  },
  {
    id: 'notif_5',
    title: '영양분 알림',
    message: '몬스테라에 영양분을 공급할 시간입니다.',
    date: '2024.04.20',
    isRead: false,
    type: 'nutrient',
    plantId: 'mp_5'
  }
];

// 레벨 경험치 요구사항은 타입 모델에서 가져오기
export { LEVEL_EXP_REQUIREMENTS as levelExpRequirements } from '@/types/models/user';

// 프로필 이미지
export const profileImg = '/images/Profile.png';

// 식물 상세 데이터
export * from './plantDetailData';
