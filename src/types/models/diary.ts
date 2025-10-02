export type DiaryMoodStatus = 'good' | 'normal' | 'bad';

import type { Diary as PrismaDiary } from '@prisma/client';

export type Diary = PrismaDiary;

export interface DiaryPreview {
  id: string;
  title: string;
  content: string;
  image: string | null;
  status: DiaryMoodStatus;
  viewCount: number;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  plant?: {
    id: string;
    plantName: string;
    image: string | null;
  } | null;
  _count?: {
    likes: number;
  };
}

/**
 * Diary 생성 Input (폼 데이터용)
 */
export interface DiaryCreateInput {
  title: string;
  content: string;
  image?: string | null;
  status: DiaryMoodStatus;
  plantId?: string | null;
  tags?: string[];
}

/**
 * Diary 수정 Input (폼 데이터용)
 */
export interface DiaryUpdateInput {
  title?: string;
  content?: string;
  image?: string | null;
  status?: DiaryMoodStatus;
  plantId?: string | null;
  tags?: string[];
}
