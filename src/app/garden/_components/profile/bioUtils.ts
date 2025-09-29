const BIO_CHAR_LIMIT = 130;
const BIO_LINE_LIMIT = 3;

//더보기 버튼이 필요한지 확인
export function shouldShowBioToggle(bio: string | null | undefined): boolean {
  if (!bio) return false;

  return bio.length > BIO_CHAR_LIMIT || bio.split('\n').length > BIO_LINE_LIMIT;
}

//글자수 기준으로 자르기 (단어 단위)
function getTruncatedByChar(text: string): string {
  const truncated = text.slice(0, BIO_CHAR_LIMIT);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  const lastNewlineIndex = truncated.lastIndexOf('\n');

  // 마지막 공백 또는 줄바꿈 위치 찾기
  const lastBreakIndex = Math.max(lastSpaceIndex, lastNewlineIndex);

  // 마지막 단어가 잘려서 부자연스러우면 마지막 공백/줄바꿈에서 자르기
  if (lastBreakIndex > BIO_CHAR_LIMIT - 20) {
    return truncated.slice(0, lastBreakIndex);
  }

  return truncated;
}

// 줄바꿈과 글자수 기준으로 bio 자르기
export function getTruncatedBio(text: string): string {
  const lines = text.split('\n');

  if (lines.length > BIO_LINE_LIMIT) {
    const truncatedLines = lines.slice(0, BIO_LINE_LIMIT);
    const truncatedText = truncatedLines.join('\n');

    if (truncatedText.length > BIO_CHAR_LIMIT) {
      return getTruncatedByChar(truncatedText);
    }

    return truncatedText;
  }

  if (text.length > BIO_CHAR_LIMIT) {
    return getTruncatedByChar(text);
  }

  return text;
}
