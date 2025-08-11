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
 * 한국어 형식으로 포맷팅
 */
export function formatDateKorean(date: Date | string): string {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('ko-KR', {
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
 * 간단한 날짜 포맷 (YYYY.MM.DD) - 일반 표시용
 */
export function formatDate(dateValue: Date | string): string {
  if (!dateValue) return '';

  let dateStr: string;
  if (typeof dateValue === 'string') {
    dateStr = dateValue.split('T')[0];
  } else {
    dateStr = dateValue.toISOString().split('T')[0];
  }

  return dateStr.replace(/-/g, '.');
}

/**
 * 케어 게이지 진행률 계산 (역방향) - 물/영양제 케어용
 * 마지막 케어 날짜부터 시작해서 시간이 지날수록 게이지가 감소
 * @param lastCareDate - 마지막 케어 날짜 (YYYY-MM-DD)
 * @param nextCareDate - 다음 케어 예정 날짜 (YYYY-MM-DD)
 * @returns 0-100 사이의 퍼센티지 (100%: 방금 케어함, 0%: 케어 필요)
 */
export function calculateProgressPercentage(
  lastCareDate: string,
  nextCareDate: string
): number {
  if (!lastCareDate || !nextCareDate) return 0;

  // 자정 기준으로 날짜 계산
  const lastDate = new Date(lastCareDate + 'T00:00:00');
  const nextDate = new Date(nextCareDate + 'T00:00:00');
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // 오늘 자정

  const lastTime = lastDate.getTime();
  const nextTime = nextDate.getTime();
  const currentTime = currentDate.getTime();

  // 오늘 케어한 경우 100% 반환
  if (currentTime === lastTime) return 100;
  
  if (currentTime < lastTime) return 100;
  if (currentTime >= nextTime) return 0;

  const totalInterval = nextTime - lastTime;
  const remainingTime = nextTime - currentTime;
  const progress = (remainingTime / totalInterval) * 100;

  return Math.max(0, Math.min(100, Math.round(progress)));
}