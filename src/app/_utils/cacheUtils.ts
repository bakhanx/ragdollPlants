/**
 * 캐시 안전한 데이터 변환 유틸리티 함수들
 * unstable_cache에서 Date 객체를 직렬화할 수 없는 문제를 해결하기 위해
 * Date 필드를 ISO 문자열로 변환하는 함수들
 */

/**
 * Date 객체를 시간대 독립적인 YYYY-MM-DD 문자열로 변환
 */
function formatDateToString(date: Date | null | undefined): string | null {
  if (!date) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Plant 데이터를 캐시 안전한 형태로 변환
 */
export function plantForCache<
  T extends {
    purchaseDate?: Date | null;
    lastWateredDate?: Date | null;
    nextWateringDate?: Date | null;
    lastNutrientDate?: Date | null;
    nextNutrientDate?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
  }
>(
  plant: T
): Omit<
  T,
  | 'purchaseDate'
  | 'lastWateredDate'
  | 'nextWateringDate'
  | 'lastNutrientDate'
  | 'nextNutrientDate'
  | 'createdAt'
  | 'updatedAt'
> & {
  purchaseDate: string | null;
  lastWateredDate: string | null;
  nextWateringDate: string | null;
  lastNutrientDate: string | null;
  nextNutrientDate: string | null;
  createdAt: string;
  updatedAt: string;
} {
  return {
    ...plant,
    purchaseDate: formatDateToString(plant.purchaseDate),
    lastWateredDate: formatDateToString(plant.lastWateredDate),
    nextWateringDate: formatDateToString(plant.nextWateringDate),
    lastNutrientDate: formatDateToString(plant.lastNutrientDate),
    nextNutrientDate: formatDateToString(plant.nextNutrientDate),
    createdAt: plant.createdAt?.toISOString() || '',
    updatedAt: plant.updatedAt?.toISOString() || ''
  };
}

/**
 * Diary 데이터를 캐시 안전한 형태로 변환
 */
export function diaryForCache<
  T extends {
    date?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }
>(
  diary: T
): Omit<T, 'date' | 'createdAt' | 'updatedAt'> & {
  date: string;
  createdAt: string;
  updatedAt: string;
} {
  return {
    ...diary,
    date: diary.date?.toISOString() || '',
    createdAt: diary.createdAt?.toISOString() || '',
    updatedAt: diary.updatedAt?.toISOString() || ''
  };
}

/**
 * Gallery 데이터를 캐시 안전한 형태로 변환
 */
export function galleryForCache<
  T extends {
    createdAt?: Date;
    updatedAt?: Date;
  }
>(
  gallery: T
): Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
} {
  return {
    ...gallery,
    createdAt: gallery.createdAt?.toISOString() || '',
    updatedAt: gallery.updatedAt?.toISOString() || ''
  };
}

/**
 * Article 데이터를 캐시 안전한 형태로 변환
 */
export function articleForCache<
  T extends {
    createdAt?: Date;
    updatedAt?: Date;
  }
>(
  article: T
): Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
} {
  return {
    ...article,
    createdAt: article.createdAt?.toISOString() || '',
    updatedAt: article.updatedAt?.toISOString() || ''
  };
}

/**
 * Event 데이터를 캐시 안전한 형태로 변환
 */
export function eventForCache<
  T extends {
    startDate?: Date;
    endDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }
>(
  event: T
): Omit<T, 'startDate' | 'endDate' | 'createdAt' | 'updatedAt'> & {
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
} {
  return {
    ...event,
    startDate: event.startDate?.toISOString() || '',
    endDate: event.endDate?.toISOString() || '',
    createdAt: event.createdAt?.toISOString() || '',
    updatedAt: event.updatedAt?.toISOString() || ''
  };
}
