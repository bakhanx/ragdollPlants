import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    // 관리자 권한 확인
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다' }, { status: 403 });
    }

    const { id } = await params;
    const { isEnded } = await request.json();

    // 이벤트 존재 확인
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) }
    });

    if (!event) {
      return NextResponse.json({ error: '이벤트를 찾을 수 없습니다' }, { status: 404 });
    }

    // 이벤트 상태 업데이트
    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(id) },
      data: { isEnded: isEnded }
    });

    return NextResponse.json({ 
      success: true, 
      message: `이벤트가 ${isEnded ? '종료' : '재시작'}되었습니다`,
      event: updatedEvent
    });

  } catch (error) {
    console.error('이벤트 상태 변경 오류:', error);
    return NextResponse.json(
      { error: '이벤트 상태 변경 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}