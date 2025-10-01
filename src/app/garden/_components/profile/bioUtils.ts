const CHARS_PER_LINE = 26;
const MAX_LINES = 3;

/**
 * bio 텍스트가 더보기 버튼이 필요한지 확인
 */
export function shouldShowBioToggle(bio: string | null | undefined): boolean {
  if (!bio) return false;

  // 전체 글자수를 줄로 계산 + 명시적 줄바꿈(\n) 개수 추가
  const baseLines = Math.ceil(bio.length / CHARS_PER_LINE);
  const newlineCount = (bio.match(/\n/g) || []).length;
  const totalLines = baseLines + newlineCount;
  return totalLines > MAX_LINES;
}

/**
 * bio 텍스트를 줄 기준으로 자르기
 */
export function getTruncatedBio(text: string): string {
  // 더보기가 필요없으면 그대로 반환
  if (!shouldShowBioToggle(text)) {
    return text;
  }
  
  // 줄에 해당하는 대략적인 글자수로 자르기 
  const maxChars = CHARS_PER_LINE * MAX_LINES;
  
  if (text.length <= maxChars) {
    return text;
  }
  
  const truncated = text.slice(0, maxChars);
  
  // 단어 단위로 자연스럽게 자르기
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  const lastNewlineIndex = truncated.lastIndexOf('\n');
  const lastBreakIndex = Math.max(lastSpaceIndex, lastNewlineIndex);
  
  // 마지막 20글자 안에 공백/줄바꿈이 있으면 그곳에서 자르기
  if (lastBreakIndex > maxChars -20) {
    return truncated.slice(0, lastBreakIndex);
  }
  
  return truncated;
}
