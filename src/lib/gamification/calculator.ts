import { LevelInfo } from './types';
import { LEVEL_TITLES, getRequiredExperience, MAX_LEVEL } from './constants';

/**
 * 총 경험치를 기반으로 현재 레벨을 계산
 */
export function calculateLevel(totalExperience: number): number {
  if (totalExperience < 0) return 1;
  
  for (let level = 1; level <= MAX_LEVEL; level++) {
    const requiredExp = getRequiredExperience(level);
    if (totalExperience < requiredExp) {
      return level;
    }
  }
  
  return MAX_LEVEL;
}

/**
 * 레벨 정보를 계산하여 반환
 */
export function getLevelInfo(totalExperience: number): LevelInfo {
  const currentLevel = calculateLevel(totalExperience);
  const currentLevelExp = currentLevel > 1 ? getRequiredExperience(currentLevel - 1) : 0;
  const nextLevelExp = currentLevel < MAX_LEVEL ? getRequiredExperience(currentLevel) : getRequiredExperience(MAX_LEVEL);
  
  const expInCurrentLevel = totalExperience - currentLevelExp;
  const expNeededForNext = nextLevelExp - currentLevelExp;
  const progress = currentLevel >= MAX_LEVEL ? 100 : Math.floor((expInCurrentLevel / expNeededForNext) * 100);
  
  return {
    level: currentLevel,
    title: LEVEL_TITLES[currentLevel] || '정원사',
    requiredExp: currentLevelExp,
    nextLevelExp: nextLevelExp,
    progress: Math.max(0, Math.min(100, progress)),
  };
}

/**
 * 레벨업 여부 확인
 */
export function checkLevelUp(oldExperience: number, newExperience: number): boolean {
  const oldLevel = calculateLevel(oldExperience);
  const newLevel = calculateLevel(newExperience);
  return newLevel > oldLevel;
}