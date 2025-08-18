import { prisma } from '@/lib/prisma';
import { ActivityType, ExperienceGain } from './types';
import { EXPERIENCE_POINTS } from './constants';
import { checkLevelUp, calculateLevel } from './calculator';

/**
 * 사용자에게 경험치를 부여하고 레벨업 체크
 */
export async function grantExperience(
  userId: string,
  activityType: ActivityType,
  reason?: string
): Promise<ExperienceGain> {
  const expAmount = EXPERIENCE_POINTS[activityType];
  
  // 현재 사용자 정보 조회
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { experience: true, level: true },
  });
  
  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }
  
  const oldExperience = user.experience;
  const newExperience = oldExperience + expAmount;
  const levelUp = checkLevelUp(oldExperience, newExperience);
  const newLevel = calculateLevel(newExperience);
  
  // 사용자 정보 업데이트
  await prisma.user.update({
    where: { id: userId },
    data: {
      experience: newExperience,
      level: newLevel,
      lastActivityDate: new Date(),
    },
  });
  
  return {
    amount: expAmount,
    reason: reason || `${activityType} 활동`,
    levelUp,
    newLevel: levelUp ? newLevel : undefined,
  };
}

/**
 * 여러 활동에 대한 경험치를 한 번에 부여
 */
export async function grantMultipleExperience(
  userId: string,
  activities: { type: ActivityType; reason?: string }[]
): Promise<ExperienceGain[]> {
  const results: ExperienceGain[] = [];
  
  for (const activity of activities) {
    const result = await grantExperience(userId, activity.type, activity.reason);
    results.push(result);
  }
  
  return results;
}