'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath, unstable_cache } from 'next/cache';
import { z } from 'zod';
import {
  requireAdmin,
  validateEventOwnership,
  getCurrentUser
} from '@/lib/auth-utils';
import {
  uploadImageToCloudflare,
  deleteImageFromCloudflare
} from '@/lib/cloudflare-images';
import { CacheTags } from '@/lib/cache/cacheTags';
import {
  revalidateUserCache,
  revalidateEventUpdate
} from '@/lib/cache/cacheInvalidation';
import { CachedEvent, EventsResponse } from '@/types/cache/event';
import { eventForCache } from '@/app/_utils/cacheUtils';

// 이벤트 생성 유효성 검사 스키마
const createEventSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다'),
  subtitle: z.string().min(1, '부제목은 필수입니다'),
  description: z.string().min(1, '설명은 필수입니다'),
  content: z.string().min(1, '내용은 필수입니다'),
  image: z.string().min(1, '이미지는 필수입니다'),
  startDate: z.string().datetime('유효한 시작 날짜를 입력해주세요'),
  endDate: z.string().datetime('유효한 종료 날짜를 입력해주세요')
});

// 이벤트 목록 조회 내부 구현
async function getEventsInternal(): Promise<EventsResponse> {
  const now = new Date();

  // 종료 날짜가 지난 이벤트들의 isEnded를 true로 업데이트
  await prisma.event.updateMany({
    where: {
      endDate: { lt: now },
      isEnded: false
    },
    data: { isEnded: true }
  });

  const events = await prisma.event.findMany({
    where: { isActive: true },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // 캐시용 데이터로 변환
  const cachedEvents = events.map(eventForCache);

  return {
    events: cachedEvents,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalCount: cachedEvents.length,
      limit: cachedEvents.length,
      hasNextPage: false,
      hasPreviousPage: false
    }
  };
}

// 캐시된 이벤트 목록 조회 함수
const getCachedEvents = unstable_cache(
  () => getEventsInternal(),
  ['events-all'],
  {
    tags: [CacheTags.allEvents]
  }
);

// 모든 이벤트 조회 (캐시 적용)
export async function getEvents(): Promise<EventsResponse> {
  try {
    const user = await getCurrentUser().catch(() => null);

    // 비로그인 사용자도 이벤트 조회 가능 (공개 데이터)
    return getCachedEvents();
  } catch (error) {
    console.error('이벤트 목록 조회 오류:', error);
    throw new Error('이벤트 목록을 불러오는 중 오류가 발생했습니다.');
  }
}

// 진행중인 이벤트만 조회
export async function getActiveEvents() {
  try {
    const now = new Date();

    // 종료 날짜가 지난 이벤트들의 isEnded를 true로 업데이트
    await prisma.event.updateMany({
      where: {
        endDate: { lt: now },
        isEnded: false
      },
      data: { isEnded: true }
    });

    const events = await prisma.event.findMany({
      where: {
        isEnded: false,
        isActive: true
      },
      select: {
        id: true,
        title: true,
        subtitle: true,
        description: true,
        image: true,
        startDate: true,
        endDate: true,
        isEnded: true,
        viewCount: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return events;
  } catch (error) {
    console.error('진행중인 이벤트 조회 오류:', error);
    throw new Error('진행중인 이벤트를 불러오는 중 오류가 발생했습니다.');
  }
}

// 배너용 진행중인 이벤트 조회 내부 구현
async function getActiveEventsForBannerInternal(limit: number = 3) {
  const now = new Date();

  // 종료 날짜가 지난 이벤트들의 isEnded를 true로 업데이트
  await prisma.event.updateMany({
    where: {
      endDate: { lt: now },
      isEnded: false
    },
    data: { isEnded: true }
  });

  const events = await prisma.event.findMany({
    where: {
      isEnded: false,
      isActive: true
    },
    select: {
      id: true,
      title: true,
      subtitle: true,
      image: true,
      isEnded: true,
      endDate: true,
      createdAt: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: limit
  });

  return events;
}

// 캐시된 배너용 이벤트 조회
const getCachedActiveEventsForBanner = unstable_cache(
  getActiveEventsForBannerInternal,
  ['home-banner-events'],
  {
    tags: [CacheTags.homeBanner, CacheTags.allEvents]
  }
);

// 배너용 진행중인 이벤트 조회 (최신순으로 지정된 개수만)
export async function getActiveEventsForBanner(limit: number = 3) {
  try {
    return await getCachedActiveEventsForBanner(limit);
  } catch (error) {
    console.error('배너용 진행중인 이벤트 조회 오류:', error);
    throw new Error(
      '배너용 진행중인 이벤트를 불러오는 중 오류가 발생했습니다.'
    );
  }
}

// 이벤트 상세 조회 내부 구현
async function getEventByIdInternal(id: number) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    }
  });

  if (!event || !event.isActive) {
    return null;
  }

  return eventForCache(event);
}

// 캐시된 이벤트 상세 조회 함수 (클로저 활용)
function getCachedEventById(eventId: number) {
  return unstable_cache(
    () => getEventByIdInternal(eventId),
    [`event-detail-${eventId}`],
    {
      tags: [CacheTags.event(eventId.toString())]
    }
  )();
}

// 특정 이벤트 조회
export async function getEventById(id: number) {
  try {
    const now = new Date();

    // 캐시된 이벤트 기본 정보 조회
    const cachedEvent = await getCachedEventById(id);

    if (!cachedEvent) {
      throw new Error('이벤트를 찾을 수 없거나 비활성화된 이벤트입니다.');
    }

    // 종료 날짜가 지났고 아직 종료 처리가 안 된 경우 업데이트
    const endDate = new Date(cachedEvent.endDate);
    if (endDate < now && !cachedEvent.isEnded) {
      await prisma.event.update({
        where: { id },
        data: { isEnded: true }
      });
      cachedEvent.isEnded = true;
    }

    // 조회수 증가
    await prisma.event.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1
        }
      }
    });

    return cachedEvent;
  } catch (error) {
    console.error('이벤트 조회 오류:', error);
    throw error;
  }
}

// 이벤트 생성
export async function createEvent(formData: FormData) {
  try {
    // 사용자 정보 가져오기 및 관리자 권한 확인
    const user = await requireAdmin();

    const rawData = {
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
      description: formData.get('description') as string,
      content: formData.get('content') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string
    };

    // 이미지 파일 처리
    let imageUrl = '';
    const imageFile = formData.get('image') as File | null;

    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImageToCloudflare(
        imageFile,
        '/images/plant-default.webp'
      );
    }

    // 입력 검증
    const validationResult = createEventSchema.safeParse({
      ...rawData,
      image: imageUrl
    });

    if (!validationResult.success) {
      const errors = validationResult.error.errors
        .map(err => err.message)
        .join(', ');
      throw new Error(errors);
    }

    const validatedData = validationResult.data;

    // 이벤트 생성
    const event = await prisma.event.create({
      data: {
        title: validatedData.title,
        subtitle: validatedData.subtitle,
        description: validatedData.description,
        content: validatedData.content,
        image: validatedData.image,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
        authorId: user.id,
        isEnded: false
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    console.log('이벤트 생성 완료:', { id: event.id, title: event.title });

    // 캐시 무효화
    revalidateUserCache('eventCreate', user.id);

    // 성공 결과 반환
    return {
      success: true,
      eventId: event.id,
      redirectTo: `/events/${event.id}`
    };
  } catch (error) {
    console.error('이벤트 생성 오류:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : '이벤트 생성에 실패했습니다'
    };
  }
}

// 이벤트 수정
export async function updateEvent(id: number, formData: FormData) {
  try {
    // 사용자 정보 가져오기 및 관리자 권한 확인
    const user = await requireAdmin();

    // 기존 이벤트 확인 및 권한 체크
    const existingEvent = await validateEventOwnership(id, user.id);

    const rawData = {
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
      description: formData.get('description') as string,
      content: formData.get('content') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string
    };

    // 이미지 파일 처리
    const imageFile = formData.get('image') as File | null;
    let imageUrl = existingEvent.image; // 기존 이미지 유지

    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImageToCloudflare(
        imageFile,
        '/images/plant-default.webp'
      );

      // 기존 이미지가 있고 기본 이미지가 아닌 경우 삭제
      if (
        existingEvent.image &&
        !existingEvent.image.includes('/images/plant-default.webp') &&
        !existingEvent.image.startsWith('data:')
      ) {
        await deleteImageFromCloudflare(existingEvent.image);
      }
    }

    // 입력 검증
    const validationResult = createEventSchema.safeParse({
      ...rawData,
      image: imageUrl
    });

    if (!validationResult.success) {
      const errors = validationResult.error.errors
        .map(err => err.message)
        .join(', ');
      throw new Error(errors);
    }

    const validatedData = validationResult.data;

    // 이벤트 수정
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title: validatedData.title,
        subtitle: validatedData.subtitle,
        description: validatedData.description,
        content: validatedData.content,
        image: validatedData.image,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
        updatedAt: new Date()
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    console.log('이벤트 수정 완료:', {
      id: updatedEvent.id,
      title: updatedEvent.title
    });

    // 캐시 무효화
    revalidateEventUpdate(user.id, id.toString());

    // 성공 결과 반환
    return {
      success: true,
      eventId: updatedEvent.id,
      redirectTo: `/events/${id}`
    };
  } catch (error) {
    console.error('이벤트 수정 오류:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : '이벤트 수정에 실패했습니다'
    };
  }
}

// 이벤트 삭제
export async function deleteEvent(id: number) {
  try {
    const user = await requireAdmin();

    // 이벤트 조회
    const event = await prisma.event.findUnique({
      where: { id }
    });

    if (!event) {
      throw new Error('이벤트를 찾을 수 없습니다.');
    }

    // 이미지 파일도 삭제
    if (
      event.image &&
      !event.image.includes('/images/plant-default.webp') &&
      !event.image.startsWith('data:')
    ) {
      await deleteImageFromCloudflare(event.image);
    }

    // 이벤트 삭제
    await prisma.event.delete({
      where: { id }
    });

    console.log('이벤트 삭제 완료:', { id });

    // 캐시 무효화
    revalidateUserCache('eventCreate', user.id);

    // 성공 결과 반환
    return {
      success: true,
      redirectTo: '/events'
    };
  } catch (error) {
    console.error('이벤트 삭제 오류:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : '이벤트 삭제에 실패했습니다'
    };
  }
}

// 이벤트 종료 상태 토글
export async function toggleEventEndStatus(id: number) {
  try {
    // 사용자 정보 가져오기 및 관리자 권한 확인
    const user = await requireAdmin();

    // 기존 이벤트 확인 및 권한 체크
    const existingEvent = await validateEventOwnership(id, user.id);

    // 상태 토글
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        isEnded: !existingEvent.isEnded,
        updatedAt: new Date()
      }
    });

    console.log('이벤트 상태 변경 완료:', {
      id,
      title: existingEvent.title,
      newStatus: updatedEvent.isEnded ? '종료' : '진행중'
    });

    // 캐시 무효화
    revalidateEventUpdate(user.id, id.toString());

    return { success: true, isEnded: updatedEvent.isEnded };
  } catch (error) {
    console.error('이벤트 상태 변경 오류:', error);
    throw error;
  }
}
