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

  // 완전히 시간대 독립적인 날짜 계산
  // 문자열에서 직접 날짜 파싱
  const [lastYear, lastMonth, lastDay] = lastCareDate.split('-').map(Number);
  const [nextYear, nextMonth, nextDay] = nextCareDate.split('-').map(Number);
  
  const lastDate = new Date(lastYear, lastMonth - 1, lastDay);
  const nextDate = new Date(nextYear, nextMonth - 1, nextDay);
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  const todayDate = new Date(currentYear, currentMonth, currentDay);

  const lastTime = lastDate.getTime();
  const nextTime = nextDate.getTime();
  const currentTime = todayDate.getTime();

  // 오늘 케어한 경우 100% 반환
  if (currentTime === lastTime) return 100;
  
  if (currentTime < lastTime) return 100;
  if (currentTime >= nextTime) return 0;

  const totalInterval = nextTime - lastTime;
  const remainingTime = nextTime - currentTime;
  const progress = (remainingTime / totalInterval) * 100;

  return Math.max(0, Math.min(100, Math.round(progress)));
}

/**
 * 상대적 시간 표시 ("3일 전", "1주일 전" 등)
 * @param date - 기준 날짜
 * @returns 상대적 시간 문자열
 */
export function formatRelativeTime(date: Date | string): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  if (diffMinutes < 1) return '방금 전';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays === 1) return '1일 전';
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffWeeks === 1) return '1주일 전';
  if (diffWeeks < 5) return `${diffWeeks}주일 전`;
  if (diffMonths === 1) return '1개월 전';
  if (diffMonths < 12) return `${diffMonths}개월 전`;
  if (diffYears === 1) return '1년 전';
  return `${diffYears}년 전`;
}
