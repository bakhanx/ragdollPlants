import { NextRequest, NextResponse } from 'next/server';
import { generateCareNotifications, generateUserCareNotifications } from '@/lib/notifications/careScheduler';

/**
 * 케어 알림 스케줄러 API
 * 
 * 사용 방법:
 * 1. 전체 사용자 대상: GET /api/notifications/care-scheduler
 * 2. 특정 사용자 대상: GET /api/notifications/care-scheduler?userId=USER_ID
 * 
 * 이 API는 다음 방법으로 호출할 수 있습니다:
 * 1. Vercel Cron Jobs
 * 2. GitHub Actions 스케줄러
 * 3. AWS Lambda 등 외부 스케줄링 서비스
 * 4. 수동 테스트 (개발 환경에서)
 */
export async function GET(request: NextRequest) {
  try {
    // 보안을 위해 특정 헤더나 토큰으로 접근 제한 (선택적)
    const authHeader = request.headers.get('authorization');
    const cronSecret = request.headers.get('x-cron-secret');
    
    // 환경변수로 설정된 비밀키 확인 (운영환경에서 사용)
    if (process.env.NODE_ENV === 'production') {
      const expectedSecret = process.env.CRON_SECRET;
      if (expectedSecret && cronSecret !== expectedSecret) {
        return NextResponse.json({ 
          error: 'Unauthorized' 
        }, { status: 401 });
      }
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const testMode = searchParams.get('test') === 'true';

    let result;

    if (userId) {
      // 특정 사용자의 케어 알림 생성
      console.log(`특정 사용자 ${userId}의 케어 알림 생성 시작`);
      result = await generateUserCareNotifications(userId);
      console.log(`특정 사용자 ${userId}의 케어 알림 생성 완료:`, result);
    } else {
      // 전체 사용자의 케어 알림 생성
      console.log('전체 사용자 케어 알림 생성 시작');
      result = await generateCareNotifications();
      console.log('전체 사용자 케어 알림 생성 완료:', result);
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      mode: testMode ? 'test' : 'production',
      ...result
    });

  } catch (error) {
    console.error('케어 알림 스케줄러 API 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * POST 요청으로 수동 알림 생성 (개발/테스트 목적)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userIds, force = false } = body;

    if (!userIds || !Array.isArray(userIds)) {
      return NextResponse.json({ 
        error: 'userIds array is required' 
      }, { status: 400 });
    }

    const results = [];

    for (const userId of userIds) {
      try {
        const result = await generateUserCareNotifications(userId);
        results.push({
          userId,
          success: true,
          created: result.created
        });
      } catch (error) {
        results.push({
          userId,
          success: false,
          error: error instanceof Error ? error.message : '알 수 없는 오류'
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      total: userIds.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('수동 케어 알림 생성 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
