import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();

    // 관리자 권한 확인
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다' }, { status: 403 });
    }

    console.log('🔄 데이터 백업 시작...');

    // Events 데이터 백업
    const events = await prisma.event.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Articles 데이터 백업
    const articles = await prisma.article.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // 백업 데이터 구성
    const backupData = {
      timestamp: new Date().toISOString(),
      events: events,
      articles: articles,
      summary: {
        eventsCount: events.length,
        articlesCount: articles.length
      }
    };

    console.log(`✅ 백업 완료: Events ${events.length}개, Articles ${articles.length}개`);

    return NextResponse.json(backupData, {
      headers: {
        'Content-Disposition': `attachment; filename="backup-${new Date().toISOString().split('T')[0]}.json"`,
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('❌ 백업 중 오류 발생:', error);
    return NextResponse.json({ error: '백업 중 오류가 발생했습니다' }, { status: 500 });
  }
} 