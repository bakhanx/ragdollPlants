import { ActivityType } from './types';

// 액션별 경험치 상수
export const EXPERIENCE_POINTS: Record<ActivityType, number> = {
  WATER_PLANT: 10,
  ADD_NUTRIENT: 15,
  ADD_PLANT: 30,
  CREATE_DIARY: 25,
  UPLOAD_GALLERY: 20,
  RECEIVE_LIKE: 5,
  WRITE_COMMENT: 3,
};

// 레벨별 타이틀
export const LEVEL_TITLES: Record<number, string> = {
  1: '새싹 정원사',
  2: '초보 정원사',
  3: '정원사',
  4: '숙련 정원사',
  5: '전문 정원사',
  6: '마스터 정원사',
  7: '정원 전문가',
  8: '정원 마스터',
  9: '정원 대가',
  10: '정원의 신',
};

// 레벨별 필요 경험치 (레벨 * 100)
export const getRequiredExperience = (level: number): number => {
  return level * 100;
};

// 최대 레벨
export const MAX_LEVEL = 10;