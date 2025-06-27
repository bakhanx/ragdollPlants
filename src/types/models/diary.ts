export type DiaryMoodStatus = 'good' | 'normal' | 'bad';

export interface Diary {
  id: string;
  title: string;
  content: string;
  date: Date;
  image: string | null;
  status: string;
  author?: {
    id: string;
    name: string | null;
    image: string | null;
  };
  plant?: {
    id: string;
    name: string;
  } | null;
  plantId?: string | null;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * 목록에서 사용할 간소화된 Diary 타입
 */
export interface DiaryPreview {
  id: string;
  title: string;
  content: string;
  date: string;
  image: string;
  status: DiaryMoodStatus;
  author?: {
    id: string;
    name: string;
  };
}

export interface DiaryCreateInput {
  title: string;
  content: string;
  image?: string;
  status: DiaryMoodStatus;
  authorId?: string;
  plantId?: string;
  plantName?: string;
  tags?: string[];
}

export interface DiaryUpdateInput {
  title?: string;
  content?: string;
  image?: string;
  status?: DiaryMoodStatus;
  plantId?: string;
  plantName?: string;
  tags?: string[];
}
