import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const session = await auth();

    // 관리자 권한 확인
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다' },
        { status: 403 }
      );
    }

    console.log('🔄 데이터 복원 시작...');

    let backupData;

    // 요청 본문에서 backupData 확인
    const body = await request.json().catch(() => null);

    if (body && body.backupData) {
      // 파일 업로드로 받은 백업 데이터 사용
      backupData = body.backupData;
      console.log('📂 업로드된 백업 파일 사용');
    } else {
      // 기본 백업 파일 사용
      const backupPath = path.join(
        process.cwd(),
        'public',
        'backup-2025-07-04.json'
      );

      if (!fs.existsSync(backupPath)) {
        return NextResponse.json(
          { error: '백업 파일을 찾을 수 없습니다' },
          { status: 404 }
        );
      }

      backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
      console.log('📋 기본 백업 파일 사용');
    }

    const { events, articles } = backupData;

    // 관리자 계정 확인 및 생성
    let adminUser = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!adminUser) {
      // 관리자 계정이 없으면 생성
      adminUser = await prisma.user.create({
        data: {
          id: session.user.id,
          loginId:session.user.loginId || "admin",
          email: session.user.email || 'admin@example.com',
          name: session.user.name || '관리자',
          role: 'ADMIN',
          isActive: true
        }
      });
      console.log('👤 관리자 계정 생성됨:', adminUser.email);
    }

    const adminId = adminUser.id;

    let restoredEvents = 0;
    let restoredArticles = 0;

    // 2. Events 복원 (link 필드 제외)
    for (const event of events) {
      try {
        await prisma.event.create({
          data: {
            title: event.title,
            subtitle: event.subtitle,
            image: event.image,
            description: event.description,
            content: event.content,
            startDate: new Date(event.startDate),
            endDate: new Date(event.endDate),
            isEnded: event.isEnded,
            thumbnailImage: event.thumbnailImage,
            tags: event.tags,
            viewCount: 0, // 새로 시작
            participants: 0, // 새로 시작
            authorId: adminId // 확인된 관리자 ID 사용
          }
        });
        restoredEvents++;
        console.log(`✅ Event 복원 성공: ${event.title}`);
      } catch (error) {
        console.error(`❌ Event 복원 실패: ${event.title}`, error);
      }
    }

    // 3. Articles 복원
    for (const article of articles) {
      try {
        // 카테고리 확인
        const category = await prisma.category.findUnique({
          where: { name: article.categoryId }
        });

        if (!category) {
          console.error(
            `❌ 카테고리를 찾을 수 없습니다: ${article.categoryId}`
          );
          continue;
        }

        await prisma.article.create({
          data: {
            title: article.title,
            content: article.content,
            summary: article.summary,
            image: article.image,
            tags: article.tags,
            isPublished: article.isPublished,
            viewCount: 0, // 새로 시작
            authorId: adminId, // 확인된 관리자 ID 사용
            categoryId: category.id // 실제 카테고리 ID 사용
          }
        });
        restoredArticles++;
        console.log(`✅ Article 복원 성공: ${article.title}`);
      } catch (error) {
        console.error(`❌ Article 복원 실패: ${article.title}`, error);
      }
    }

    console.log(
      `✅ 복원 완료: Events ${restoredEvents}개, Articles ${restoredArticles}개`
    );

    return NextResponse.json({
      success: true,
      message: '데이터가 성공적으로 복원되었습니다',
      restored: {
        events: restoredEvents,
        articles: restoredArticles
      }
    });
  } catch (error) {
    console.error('❌ 데이터 복원 중 오류 발생:', error);
    return NextResponse.json(
      { error: '복원 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
