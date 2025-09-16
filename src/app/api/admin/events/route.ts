import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    // 관리자 권한 확인
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다' }, { status: 403 });
    }

    // 모든 이벤트 가져오기 (최신순)
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        subtitle: true,
        startDate: true,
        endDate: true,
        isEnded: true,
        isActive: true,
        viewCount: true,
        participants: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ 
      success: true, 
      events: events 
    });

  } catch (error) {
    console.error('이벤트 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '이벤트 목록을 불러오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}