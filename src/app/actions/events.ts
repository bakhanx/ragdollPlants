'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  getCurrentUser,
  validateEventOwnership,
  requireAdminPermission
} from './utils/auth-helpers';

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

// 모든 이벤트 조회
export async function getEvents() {
  try {
    const events = await prisma.event.findMany({
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
    console.error('이벤트 목록 조회 오류:', error);
    throw new Error('이벤트 목록을 불러오는 중 오류가 발생했습니다.');
  }
}

// 진행중인 이벤트만 조회
export async function getActiveEvents() {
  try {
    const events = await prisma.event.findMany({
      where: {
        isEnded: false
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

// 배너용 진행중인 이벤트 조회 (최신순으로 지정된 개수만)
export async function getActiveEventsForBanner(limit: number = 3) {
  try {
    const events = await prisma.event.findMany({
      where: {
        isEnded: false
      },
      select: {
        id: true,
        title: true,
        subtitle: true,
        image: true,
        isEnded: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    return events;
  } catch (error) {
    console.error('배너용 진행중인 이벤트 조회 오류:', error);
    throw new Error(
      '배너용 진행중인 이벤트를 불러오는 중 오류가 발생했습니다.'
    );
  }
}

// 특정 이벤트 조회
export async function getEventById(id: number) {
  try {
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

    if (!event) {
      throw new Error('이벤트를 찾을 수 없습니다.');
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

    return event;
  } catch (error) {
    console.error('이벤트 조회 오류:', error);
    throw error;
  }
}

// 이벤트 생성
export async function createEvent(formData: FormData) {
  try {
    const user = await getCurrentUser();

    // 관리자 권한 확인
    await requireAdminPermission(user.id);

    // FormData에서 데이터 추출
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
    let imageUrl = '';

    if (imageFile && imageFile.size > 0) {
      // 실제 구현에서는 파일 스토리지에 업로드
      // 임시로 base64 인코딩 (실제 운영에서는 Cloudflare Images 등 사용 권장)
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      imageUrl = `data:${imageFile.type};base64,${base64}`;
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

    // 캐시 재검증
    revalidatePath('/events');

    return { success: true, event };
  } catch (error) {
    console.error('이벤트 생성 오류:', error);
    throw error;
  }
}

// 이벤트 수정
export async function updateEvent(id: number, formData: FormData) {
  try {
    const user = await getCurrentUser();

    // 관리자 권한 확인
    await requireAdminPermission(user.id);

    // 기존 이벤트 확인 및 권한 체크
    const existingEvent = await validateEventOwnership(id, user.id);

    // FormData에서 데이터 추출
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
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      imageUrl = `data:${imageFile.type};base64,${base64}`;
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

    // 캐시 재검증
    revalidatePath('/events');
    revalidatePath(`/events/${id}`);

    return { success: true, event: updatedEvent };
  } catch (error) {
    console.error('이벤트 수정 오류:', error);
    throw error;
  }
}

// 이벤트 삭제
export async function deleteEvent(id: number) {
  try {
    const user = await getCurrentUser();

    // 관리자 권한 확인
    await requireAdminPermission(user.id);

    // 기존 이벤트 확인 및 권한 체크
    const existingEvent = await validateEventOwnership(id, user.id);

    // 이벤트 완전 삭제
    await prisma.event.delete({
      where: { id }
    });

    console.log('이벤트 삭제 완료:', { id, title: existingEvent.title });

    // 캐시 재검증
    revalidatePath('/events');

    return { success: true };
  } catch (error) {
    console.error('이벤트 삭제 오류:', error);
    throw error;
  }
}

// 이벤트 종료 상태 토글
export async function toggleEventEndStatus(id: number) {
  try {
    const user = await getCurrentUser();

    // 관리자 권한 확인
    await requireAdminPermission(user.id);

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

    // 캐시 재검증
    revalidatePath('/events');
    revalidatePath(`/events/${id}`);

    return { success: true, isEnded: updatedEvent.isEnded };
  } catch (error) {
    console.error('이벤트 상태 변경 오류:', error);
    throw error;
  }
}
