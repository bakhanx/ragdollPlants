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
export function plantForCache<T extends { 
  purchaseDate?: Date | null;
  lastWateredDate?: Date | null;
  nextWateringDate?: Date | null;
  lastNutrientDate?: Date | null;
  nextNutrientDate?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}>(plant: T): Omit<T, 'purchaseDate' | 'lastWateredDate' | 'nextWateringDate' | 
  'lastNutrientDate' | 'nextNutrientDate' | 'createdAt' | 'updatedAt'> & {
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
 * 진행률 계산 (케어 관련)
 */
export function calculateProgressPercentage(
  startDate: string,
  endDate: string,
  currentDate: string = new Date().toISOString().split('T')[0]
): number {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const current = new Date(currentDate).getTime();
  
  if (current <= start) return 0;
  if (current >= end) return 100;
  
  const progress = ((current - start) / (end - start)) * 100;
  return Math.round(progress);
}