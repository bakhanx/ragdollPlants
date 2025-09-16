import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
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

    // 이벤트 존재 확인
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) }
    });

    if (!event) {
      return NextResponse.json({ error: '이벤트를 찾을 수 없습니다' }, { status: 404 });
    }

    // 이벤트 삭제
    await prisma.event.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ 
      success: true, 
      message: '이벤트가 삭제되었습니다'
    });

  } catch (error) {
    console.error('이벤트 삭제 오류:', error);
    return NextResponse.json(
      { error: '이벤트 삭제 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}