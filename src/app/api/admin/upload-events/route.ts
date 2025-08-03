import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { eventDetails } from '@/app/_constants/eventData';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    // 관리자 권한 확인
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다' }, { status: 403 });
    }

    let uploadedCount = 0;
    
    for (const eventData of eventDetails) {
      // 중복 확인 (제목으로)
      const existingEvent = await prisma.event.findFirst({
        where: { title: eventData.title }
      });

      if (!existingEvent) {
        // period 파싱 (예: "2024.05.01 ~ 2024.05.31")
        const periodMatch = eventData.period.match(/(\d{4})\.(\d{2})\.(\d{2})\s*~\s*(\d{4})\.(\d{2})\.(\d{2})/);
        
        let startDate = new Date();
        let endDate = new Date();
        
        if (periodMatch) {
          const [, startYear, startMonth, startDay, endYear, endMonth, endDay] = periodMatch;
          startDate = new Date(parseInt(startYear), parseInt(startMonth) - 1, parseInt(startDay));
          endDate = new Date(parseInt(endYear), parseInt(endMonth) - 1, parseInt(endDay));
        }

        await prisma.event.create({
          data: {
            title: eventData.title,
            subtitle: eventData.subtitle,
            image: eventData.imageUrl,
            description: eventData.description,
            content: eventData.content,
            startDate: startDate,
            endDate: endDate,
            isEnded: eventData.isEnded || false,
            thumbnailImage: eventData.imageUrl,
            tags: [eventData.title.split(' ')[0]], // 첫 번째 단어를 태그로
            authorId: session.user.id,
            isActive: true,
          }
        });
        uploadedCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      count: uploadedCount,
      message: `${uploadedCount}개의 이벤트가 업로드되었습니다.`
    });

  } catch (error) {
    console.error('이벤트 업로드 오류:', error);
    return NextResponse.json(
      { error: '이벤트 업로드 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}