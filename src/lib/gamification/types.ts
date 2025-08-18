// 레벨 시스템 관련 타입 정의

export interface LevelInfo {
  level: number;
  title: string;
  requiredExp: number;
  nextLevelExp: number;
  progress: number; // 0-100 퍼센트
}

export interface ExperienceGain {
  amount: number;
  reason: string;
  levelUp?: boolean;
  newLevel?: number;
}

export type ActivityType = 
  | 'WATER_PLANT'
  | 'ADD_NUTRIENT' 
  | 'ADD_PLANT'
  | 'CREATE_DIARY'
  | 'UPLOAD_GALLERY'
  | 'RECEIVE_LIKE'
  | 'WRITE_COMMENT';