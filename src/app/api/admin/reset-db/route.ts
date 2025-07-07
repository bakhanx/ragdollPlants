import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST() {
  try {
    const session = await auth();

    // 관리자 권한 확인
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다' }, { status: 403 });
    }

    console.log('🔄 데이터베이스 리셋 시작...');

    // Prisma migrate reset 실행
    const { stdout, stderr } = await execAsync(
      'npx dotenv -e .env.development -- npx prisma migrate reset --force'
    );

    if (stderr && !stderr.includes('warning')) {
      console.error('Reset 오류:', stderr);
      return NextResponse.json({ error: '리셋 중 오류가 발생했습니다' }, { status: 500 });
    }

    console.log('✅ 데이터베이스 리셋 완료');

    return NextResponse.json({ 
      success: true, 
      message: '데이터베이스가 성공적으로 리셋되었습니다' 
    });

  } catch (error) {
    console.error('❌ 데이터베이스 리셋 중 오류 발생:', error);
    return NextResponse.json({ error: '리셋 중 오류가 발생했습니다' }, { status: 500 });
  }
} 