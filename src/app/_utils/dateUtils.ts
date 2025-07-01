/**
 * 날짜 문자열을 'YYYY.MM.DD' 형식으로 변환
 * @param dateString 변환할 날짜 문자열 (예: "2024-03-20")
 * @returns 포맷된 날짜 문자열 (예: "2024.03.20")
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('유효하지 않은 날짜');
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}.${month}.${day}`;
  } catch (error) {
    console.error('날짜 포맷 에러:', error);
    return dateString; // 오류 발생 시 원본 반환
  }
}

/**
 * 두 날짜 사이의 일수를 계산
 * @param startDate 시작 날짜
 * @param endDate 종료 날짜
 * @returns 두 날짜 사이의 일수
 */
export function getDaysBetweenDates(
  startDate: string | Date,
  endDate: string | Date
): number {
  const start = startDate instanceof Date ? startDate : new Date(startDate);
  const end = endDate instanceof Date ? endDate : new Date(endDate);

  // 시간 정보 제거
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * 주어진 케어 주기에 따른 진행률(%)을 계산
 * 낮은 퍼센트일수록 물/비료가 필요한 상태이고, 100%는 케어가 완료된 상태입니다.
 * 예: 100% - 방금 물을 줌(가득 참), 0% - 물을 줘야 할 시간(비어 있음)
 *
 * @param lastCareDate 마지막 케어 날짜
 * @param nextCareDate 다음 케어 예정 날짜
 * @returns 진행률(0~100) - 높을수록 케어가 잘 된 상태
 */
export function calculateProgressPercentage(
  lastCareDate: string | Date,
  nextCareDate: string | Date,
  interval: number
): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start =
    lastCareDate instanceof Date ? lastCareDate : new Date(lastCareDate);
  const end =
    nextCareDate instanceof Date ? nextCareDate : new Date(nextCareDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  // 전체 기간 (마지막 케어 날짜부터 다음 케어 날짜까지)
  const totalDays = getDaysBetweenDates(start, end);
  if (totalDays <= 0) return 0; // 예외 처리: 간격이 0이면 0% 반환

  // 다음 케어까지 남은 일수
  const remainingDays = getDaysBetweenDates(today, end);

  // 예외 처리
  if (remainingDays < 0) return 0; // 이미 다음 케어 날짜가 지난 경우

  // 경과 기간 (마지막 케어 날짜부터 오늘까지)
  const passedDays = getDaysBetweenDates(start, today);
  if (passedDays < 0) return 100; // 마지막 케어 날짜가 미래인 경우 (방금 완료한 경우)

  // 진행률 계산 - 남은 일수 비율에 따라 계산 (남은 기간이 적을수록 낮은 %)
  const percentage = (remainingDays / totalDays) * 100;

  return Math.min(100, Math.max(0, percentage));
}

/**
 * 날짜 문자열을 한국어 형식(YYYY년 MM월 DD일)으로 변환
 * @param dateString 변환할 날짜 문자열
 * @returns 한국어 형식으로 포맷된 날짜 문자열
 */
export function formatDateKorean(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Date(dateString).toLocaleDateString('ko-KR', options);
}

/**
 * 마지막 날짜로부터 지정된 주기 이후까지 남은 일수를 계산
 * @param lastDate 마지막 날짜
 * @param cycleDays 주기 일수
 * @returns 다음 날짜까지 남은 일수
 */
export function getDaysRemaining(lastDate: string, cycleDays: number): number {
  const last = new Date(lastDate);
  const next = new Date(last);
  next.setDate(last.getDate() + cycleDays);

  const today = new Date();
  const diffTime = next.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * 날짜를 'YYYY-MM-DD HH:mm:ss' 형식으로 변환
 * @param date Date 객체 또는 날짜 문자열
 * @returns 포맷된 날짜 문자열 (예: "2025-07-01 00:00:00")
 */
export function formatDateTime(date: Date | string): string {
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new Error('유효하지 않은 날짜');
    }

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error('날짜 포맷 에러:', error);
    return date.toString(); // 오류 발생 시 원본 반환
  }
}

/**
 * 날짜에서 시간 부분만 추출
 * @param date Date 객체 또는 날짜 문자열
 * @returns 시간 문자열 (예: "00:00:00")
 */
export function formatTimeOnly(date: Date | string): string {
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new Error('유효하지 않은 날짜');
    }

    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error('시간 포맷 에러:', error);
    return '00:00:00'; // 오류 발생 시 기본값 반환
  }
}
