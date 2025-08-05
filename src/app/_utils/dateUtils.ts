/**
 * 날짜 관련 유틸리티 함수들
 */

/**
 * ISO 문자열 또는 Date 객체를 HTML input[type="date"] 형식으로 변환
 * @param dateValue - ISO 문자열, Date 객체, 또는 null
 * @returns YYYY-MM-DD 형식의 문자열 또는 빈 문자열
 */
export function formatDateForInput(dateValue: string | Date | null): string {
  if (!dateValue) return '';

  if (typeof dateValue === 'string') {
    return dateValue.split('T')[0];
  }

  if (dateValue instanceof Date) {
    return dateValue.toISOString().split('T')[0];
  }

  return '';
}

/**
 * ISO 문자열 또는 Date 객체를 표시용 날짜 형식으로 변환
 * @param dateValue - ISO 문자열, Date 객체, 또는 null
 * @returns YYYY.MM.DD 형식의 문자열 또는 빈 문자열
 */
export function formatDateForDisplay(dateValue: string | Date | null): string {
  if (!dateValue) return '';

  let dateStr: string;
  if (typeof dateValue === 'string') {
    dateStr = dateValue.split('T')[0];
  } else if (dateValue instanceof Date) {
    dateStr = dateValue.toISOString().split('T')[0];
  } else {
    return '';
  }

  return dateStr.replace(/-/g, '.');
}

/**
 * 캐시된 데이터에서 안전하게 날짜를 추출
 * @param dateValue - 캐시에서 온 날짜 값 (문자열 또는 Date)
 * @returns ISO 문자열 또는 null
 */
export function safeDateString(dateValue: string | Date | null): string | null {
  if (!dateValue) return null;

  if (typeof dateValue === 'string') {
    return dateValue;
  }

  if (dateValue instanceof Date) {
    return dateValue.toISOString();
  }

  return null;
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
    purchaseDate: plant.purchaseDate?.toISOString() || null,
    lastWateredDate: plant.lastWateredDate?.toISOString() || null,
    nextWateringDate: plant.nextWateringDate?.toISOString() || null,
    lastNutrientDate: plant.lastNutrientDate?.toISOString() || null,
    nextNutrientDate: plant.nextNutrientDate?.toISOString() || null,
    createdAt: plant.createdAt?.toISOString() || '',
    updatedAt: plant.updatedAt?.toISOString() || ''
  };
}

// 기존 함수들 (호환성 유지)

/**
 * 날짜를 한국어 형식으로 포맷팅
 */
export function formatDateKorean(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * 시간만 포맷팅
 */
export function formatTimeOnly(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * 날짜와 시간을 함께 포맷팅
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * 간단한 날짜 포맷 (YYYY.MM.DD)
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  return dateString.replace(/-/g, '.');
}

/**
 * 케어 게이지 진행률 계산 (역방향) - 물/영양제 케어용
 * 마지막 케어 날짜부터 시작해서 시간이 지날수록 게이지가 감소
 * @param lastCareDate - 마지막 케어 날짜 (YYYY-MM-DD)
 * @param nextCareDate - 다음 케어 예정 날짜 (YYYY-MM-DD)
 * @returns 0-100 사이의 퍼센티지 (100%: 방금 케어함, 0%: 케어 필요)
 */
export function calculateCareProgressPercentage(
  lastCareDate: string,
  nextCareDate: string
): number {
  if (!lastCareDate || !nextCareDate) return 0;

  // T00:00:00 - 로컬 환경 기준 날짜
  const lastDate = new Date(lastCareDate + 'T00:00:00');
  const nextDate = new Date(nextCareDate + 'T00:00:00');
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const lastTime = lastDate.getTime();
  const nextTime = nextDate.getTime();
  const currentTime = currentDate.getTime();

  if (currentDate < lastDate) return 100;

  if (currentDate >= nextDate) return 0;

  const totalInterval = nextTime - lastTime;
  const remainingTime = nextTime - currentTime;
  const progress = (remainingTime / totalInterval) * 100;

  return Math.max(0, Math.min(100, Math.round(progress)));
}
