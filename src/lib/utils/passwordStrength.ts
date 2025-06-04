export type PasswordStrength = {
  score: number; // 0-4
  level: string;
  color: string;
  bgColor: string;
  suggestions: string[];
};

/**
 * 비밀번호 강도를 계산합니다
 * @param password 비밀번호 문자열
 * @returns PasswordStrength 객체
 */
export function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      score: 0,
      level: "비밀번호를 입력하세요",
      color: "text-gray-400",
      bgColor: "bg-gray-200",
      suggestions: []
    };
  }

  let score = 0;
  const suggestions: string[] = [];

  // 길이 체크 (최대 2점)
  if (password.length >= 8) {
    score += 1;
  } else {
    suggestions.push("6글자 이상 입력하세요");
  }
  
  if (password.length >= 12) {
    score += 1;
  } else if (password.length >= 8) {
    suggestions.push("12글자 이상이면 더 안전해요");
  }

  // 문자 종류 체크 (각각 0.5점, 최대 2점)
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (hasLowercase) score += 0.5;
  else suggestions.push("소문자를 포함하면 더 안전해요");

  if (hasUppercase) score += 0.5;
  else suggestions.push("대문자를 포함하면 더 안전해요");

  if (hasNumbers) score += 0.5;
  else suggestions.push("숫자를 포함하면 더 안전해요");

  if (hasSpecialChars) score += 0.5;
  else suggestions.push("특수문자를 포함하면 더 안전해요");

  // 점수를 0-4 범위로 조정
  score = Math.min(4, Math.round(score));

  // 레벨 및 색상 결정
  switch (score) {
    case 0:
    case 1:
      return {
        score,
        level: "매우 약함",
        color: "text-red-600",
        bgColor: "bg-red-500",
        suggestions
      };
    case 2:
      return {
        score,
        level: "약함",
        color: "text-orange-600",
        bgColor: "bg-orange-500",
        suggestions
      };
    case 3:
      return {
        score,
        level: "보통",
        color: "text-yellow-600",
        bgColor: "bg-yellow-500",
        suggestions
      };
    case 4:
      return {
        score,
        level: "강함",
        color: "text-green-600",
        bgColor: "bg-green-500",
        suggestions
      };
    default:
      return {
        score: 0,
        level: "오류",
        color: "text-gray-400",
        bgColor: "bg-gray-200",
        suggestions
      };
  }
} 