import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';

const CRITICAL_PAGES = [
  '/',
  '/login',
  '/garden',
  '/myplants',
  '/diaries',
  '/galleries',
  '/care',
  '/events',
  '/articles'
];

const WARMUP_OPTIONS = {
  delay: 300,
  timeout: 15000,
  retries: 2,
  userAgent: 'Ragdoll-Admin-Cache-Warmup/1.0'
};

// 개별 페이지 워밍업
async function warmupPage(baseUrl: string, path: string, retryCount = 0) {
  const url = `${baseUrl}${path}`;
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), WARMUP_OPTIONS.timeout);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': WARMUP_OPTIONS.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      // HTML 내용으로 처리
      await response.text();
      
      const duration = Date.now() - startTime;
      return {
        success: true,
        path,
        status: response.status,
        duration
      };
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

  } catch (error) {
    const duration = Date.now() - startTime;

    if (retryCount < WARMUP_OPTIONS.retries) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return warmupPage(baseUrl, path, retryCount + 1);
    } else {
      return {
        success: false,
        path,
       error: error instanceof Error ? error.message : 'Unknown error',
        duration
      };
    }
  }
}

// 모든 페이지 순차 워밍업
async function performWarmup(baseUrl: string) {
  const results = [];
  const startTime = Date.now();

  for (const [index, path] of CRITICAL_PAGES.entries()) {
    const result = await warmupPage(baseUrl, path);
    results.push(result);

    // 마지막 페이지 아니면 잠시 대기
    if (index < CRITICAL_PAGES.length - 1) {
      await new Promise(resolve => setTimeout(resolve, WARMUP_OPTIONS.delay));
    }
  }

  const totalDuration = Date.now() - startTime;
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  return {
    total: results.length,
    successful: successful.length,
    failed: failed.length,
    duration: totalDuration,
    averageDuration: successful.length > 0 
      ? Math.round(successful.reduce((sum, r) => sum + r.duration, 0) / successful.length)
      : 0,
    results,
    timestamp: new Date().toISOString()
  };
}

export async function POST(request: NextRequest) {
  try {
    // 관리자 권한 확인
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다' },
        { status: 403 }
      );
    }

    // Base URL 결정
    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const baseUrl = `${protocol}://${host}`;

    console.log(`🚀 관리자 캐시 워밍업 시작 (요청자: ${user.email})`);
    console.log(`📍 대상 URL: ${baseUrl}`);

    // 워밍업 실행
    const summary = await performWarmup(baseUrl);

    console.log(`✅ 캐시 워밍업 완료: ${summary.successful}/${summary.total} 성공`);

    return NextResponse.json({
      success: true,
      message: '캐시 워밍업이 완료되었습니다',
      summary
    });

  } catch (error) {
    console.error('❌ 캐시 워밍업 오류:', error);

    return NextResponse.json(
      {
        error: '캐시 워밍업 중 오류가 발생했습니다',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// 워밍업 상태 확인
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      availablePages: CRITICAL_PAGES,
      options: WARMUP_OPTIONS,
      lastWarmup: null // DB에서 마지막 워밍업 시간 조회
    });

  } catch (error) {
    return NextResponse.json(
      { error: '상태 조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
