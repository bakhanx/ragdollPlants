'use server';

import { prisma } from '@/lib/prisma';
import { NotificationType } from '@prisma/client';
import { createNotificationTemplate } from './templates';

// 매일 실행할 케어 알림 체크 및 생성 함수
export async function generateCareNotifications() {
  try {
    console.log('케어 알림 생성 작업 시작:', new Date().toISOString());

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 오늘 물을 줘야 하는 식물들 조회
    const plantsNeedingWater = await prisma.plant.findMany({
      where: {
        isActive: true,
        nextWateringDate: {
          lte: today
        }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // 오늘 영양제를 줘야 하는 식물들 조회
    const plantsNeedingNutrient = await prisma.plant.findMany({
      where: {
        isActive: true,
        nextNutrientDate: {
          lte: today
        }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // 내일 물을 줘야 하는 식물들 조회 (사전 알림)
    const plantsNeedingWaterTomorrow = await prisma.plant.findMany({
      where: {
        isActive: true,
        nextWateringDate: {
          gte: tomorrow,
          lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)
        }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    const notifications: Array<{
      type: NotificationType;
      title: string;
      message: string;
      link?: string;
      recipientId: string;
      plantId?: string;
    }> = [];

    // 오늘 물주기 알림 생성
    for (const plant of plantsNeedingWater) {
      const template = createNotificationTemplate('PLANT_CARE_WATER', {
        plantName: plant.name,
        isOverdue: plant.nextWateringDate
          ? plant.nextWateringDate < today
          : false,
        overdueDays: plant.nextWateringDate
          ? Math.floor(
              (today.getTime() - plant.nextWateringDate.getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : 0
      });

      notifications.push({
        type: 'PLANT_CARE_WATER',
        title: template.title,
        message: template.message,
        link: `/care`,
        recipientId: plant.author.id,
        plantId: plant.id
      });
    }

    // 오늘 영양제 알림 생성
    for (const plant of plantsNeedingNutrient) {
      const template = createNotificationTemplate('PLANT_CARE_NUTRIENT', {
        plantName: plant.name,
        isOverdue: plant.nextNutrientDate
          ? plant.nextNutrientDate < today
          : false,
        overdueDays: plant.nextNutrientDate
          ? Math.floor(
              (today.getTime() - plant.nextNutrientDate.getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : 0
      });

      notifications.push({
        type: 'PLANT_CARE_NUTRIENT',
        title: template.title,
        message: template.message,
        link: `/care`,
        recipientId: plant.author.id,
        plantId: plant.id
      });
    }

    // 내일 물주기 사전 알림 생성 (선택적)
    for (const plant of plantsNeedingWaterTomorrow) {
      const template = createNotificationTemplate('PLANT_CARE_WATER', {
        plantName: plant.name,
        isReminder: true
      });

      notifications.push({
        type: 'PLANT_CARE_WATER',
        title: template.title,
        message: template.message,
        link: `/care`,
        recipientId: plant.author.id,
        plantId: plant.id
      });
    }

    // 중복 알림 방지를 위한 체크
    const existingNotifications = await prisma.notification.findMany({
      where: {
        type: {
          in: ['PLANT_CARE_WATER', 'PLANT_CARE_NUTRIENT']
        },
        plantId: {
          in: [
            ...plantsNeedingWater.map(p => p.id),
            ...plantsNeedingNutrient.map(p => p.id)
          ]
        },
        createdAt: {
          gte: today
        }
      },
      select: {
        plantId: true,
        type: true,
        recipientId: true
      }
    });

    // 이미 생성된 알림 제외
    const filteredNotifications = notifications.filter(notification => {
      return !existingNotifications.some(
        existing =>
          existing.plantId === notification.plantId &&
          existing.type === notification.type &&
          existing.recipientId === notification.recipientId
      );
    });

    // 알림 일괄 생성
    if (filteredNotifications.length > 0) {
      await prisma.notification.createMany({
        data: filteredNotifications.map(notification => ({
          type: notification.type,
          title: notification.title,
          message: notification.message,
          link: notification.link,
          recipientId: notification.recipientId,
          plantId: notification.plantId,
          isRead: false
        }))
      });
    }

    console.log(
      `케어 알림 생성 완료: ${filteredNotifications.length}개 알림 생성`,
      `(물주기: ${filteredNotifications.filter(n => n.type === 'PLANT_CARE_WATER').length}개,`,
      `영양제: ${filteredNotifications.filter(n => n.type === 'PLANT_CARE_NUTRIENT').length}개)`
    );

    return {
      success: true,
      created: filteredNotifications.length,
      waterNotifications: filteredNotifications.filter(
        n => n.type === 'PLANT_CARE_WATER'
      ).length,
      nutrientNotifications: filteredNotifications.filter(
        n => n.type === 'PLANT_CARE_NUTRIENT'
      ).length
    };
  } catch (error) {
    console.error('케어 알림 생성 중 오류 발생:', error);
    throw error;
  }
}

/**
 * 특정 사용자의 오늘 케어 알림을 수동으로 생성
 * (테스트, 디버깅)
 */
export async function generateUserCareNotifications(userId: string) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const userPlants = await prisma.plant.findMany({
      where: {
        authorId: userId,
        isActive: true,
        OR: [
          { nextWateringDate: { lte: today } },
          { nextNutrientDate: { lte: today } }
        ]
      }
    });

    const notifications = [];

    for (const plant of userPlants) {
      if (plant.nextWateringDate && plant.nextWateringDate <= today) {
        const template = createNotificationTemplate('PLANT_CARE_WATER', {
          plantName: plant.name,
          isOverdue: plant.nextWateringDate < today,
          overdueDays: Math.floor(
            (today.getTime() - plant.nextWateringDate.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        });

        notifications.push({
          type: 'PLANT_CARE_WATER' as NotificationType,
          title: template.title,
          message: template.message,
          link: '/care',
          recipientId: userId,
          plantId: plant.id
        });
      }

      if (plant.nextNutrientDate && plant.nextNutrientDate <= today) {
        const template = createNotificationTemplate('PLANT_CARE_NUTRIENT', {
          plantName: plant.name,
          isOverdue: plant.nextNutrientDate < today,
          overdueDays: Math.floor(
            (today.getTime() - plant.nextNutrientDate.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        });

        notifications.push({
          type: 'PLANT_CARE_NUTRIENT' as NotificationType,
          title: template.title,
          message: template.message,
          link: '/care',
          recipientId: userId,
          plantId: plant.id
        });
      }
    }

    if (notifications.length > 0) {
      await prisma.notification.createMany({
        data: notifications.map(n => ({
          ...n,
          isRead: false
        }))
      });
    }

    return { success: true, created: notifications.length };
  } catch (error) {
    console.error(`사용자 ${userId}의 케어 알림 생성 중 오류:`, error);
    throw error;
  }
}
