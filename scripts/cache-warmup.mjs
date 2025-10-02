#!/usr/bin/env node

/**
 * 서버 캐시 워밍업 스크립트
 * 주요 페이지들을 순차적으로 방문하여 서버 캐시(unstable_cache)를 미리 생성
 */

import { performance } from 'perf_hooks';

// 환경별 base URL 설정
const BASE_URL = process.env.WARMUP_URL || process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NODE_ENV === 'production' 
    ? 'https://ragdollplants.vercel.app'  // 실제 도메인으로 변경 필요
    : 'http://localhost:3000';

// 워밍업할 주요 페이지들 (사용자가 제안한 순서)
const CRITICAL_PAGES = [
  '/',           // 홈페이지
  '/login',      // 로그인 페이지
  '/garden',     // 사용자 프로필 목록
  '/myplants',   // 개인 식물 목록  
  '/diaries',    // 다이어리 목록
  '/galleries',  // 갤러리 목록
  '/care',       // 케어 페이지
  '/events',     // 이벤트 목록
  '/articles'    // 아티클 목록
];

// 워밍업 옵션
const WARMUP_OPTIONS = {
  delay: 300,           // 페이지 간 대기 시간 (ms) - 서버 부하 방지
  timeout: 15000,       // 각 페이지 타임아웃 (ms)  
  retries: 2,           // 실패 시 재시도 횟수
  userAgent: 'Ragdoll-Cache-Warmup-Bot/1.0'
};

/**
 * 개별 페이지 워밍업
 */
async function warmupPage(path, retryCount = 0) {
  const url = `${BASE_URL}${path}`;
  const startTime = performance.now();
  
  try {
    console.log(`🔥 워밍업: ${path}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), WARMUP_OPTIONS.timeout);
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': WARMUP_OPTIONS.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.8,en-US;q=0.5',
        'Cache-Control': 'no-cache', // 항상 서버에서 새로 받아서 캐시 생성
        'Connection': 'keep-alive'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      // HTML 내용을 실제로 읽어서 완전한 처리 보장
      await response.text();
      
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      
      console.log(`✅ ${path} (${response.status}, ${duration}ms)`);
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
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);
    
    if (retryCount < WARMUP_OPTIONS.retries) {
      console.log(`⚠️ ${path} 재시도 (${retryCount + 1}/${WARMUP_OPTIONS.retries})`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return warmupPage(path, retryCount + 1);
    } else {
      console.log(`❌ ${path} - ${error.name}: ${error.message} (${duration}ms)`);
      return { 
        success: false, 
        path, 
        error: error.message, 
        duration 
      };
    }
  }
}

/**
 * 모든 페이지 순차 워밍업
 */
export async function warmupAllPages() {
  console.log('🌿 Ragdoll Plants 캐시 워밍업 시작');
  console.log(`📍 대상 URL: ${BASE_URL}`);
  console.log(`📄 페이지 수: ${CRITICAL_PAGES.length}개`);
  console.log(`⏱️ 시작 시간: ${new Date().toLocaleString('ko-KR')}`);
  console.log('─'.repeat(60));
  
  const results = [];
  const overallStartTime = performance.now();
  
  for (const [index, path] of CRITICAL_PAGES.entries()) {
    const result = await warmupPage(path);
    results.push(result);
    
    // 마지막 페이지가 아니면 잠시 대기 (서버 부하 방지)
    if (index < CRITICAL_PAGES.length - 1) {
      await new Promise(resolve => setTimeout(resolve, WARMUP_OPTIONS.delay));
    }
  }
  
  // 결과 요약
  const overallEndTime = performance.now();
  const totalDuration = Math.round(overallEndTime - overallStartTime);
  
  console.log('─'.repeat(60));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log('📊 워밍업 완료 요약:');
  console.log(`✅ 성공: ${successful.length}/${results.length}`);
  console.log(`❌ 실패: ${failed.length}/${results.length}`);
  console.log(`⏱️ 총 소요시간: ${totalDuration}ms (${Math.round(totalDuration/1000)}초)`);
  
  if (successful.length > 0) {
    const avgDuration = Math.round(
      successful.reduce((sum, r) => sum + r.duration, 0) / successful.length
    );
    console.log(`📈 평균 응답시간: ${avgDuration}ms`);
  }
  
  if (failed.length > 0) {
    console.log('\n❌ 실패한 페이지들:');
    failed.forEach(r => {
      console.log(`  - ${r.path}: ${r.error}`);
    });
  }
  
  console.log(`\n🎉 워밍업 완료! (${new Date().toLocaleString('ko-KR')})`);
  
  return {
    total: results.length,
    successful: successful.length,
    failed: failed.length,
    duration: totalDuration,
    results
  };
}

/**
 * 서버 헬스체크
 */
async function healthCheck() {
  try {
    console.log('🏥 서버 상태 확인 중...');
    
    const response = await fetch(`${BASE_URL}`, { 
      timeout: 10000,
      headers: { 'User-Agent': WARMUP_OPTIONS.userAgent }
    });
    
    if (response.ok) {
      console.log('✅ 서버 정상 동작 확인');
      return true;
    } else {
      console.log(`❌ 서버 응답 오류: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ 서버 연결 실패: ${error.message}`);
    console.log('   서버가 시작되지 않았거나 네트워크 연결에 문제가 있을 수 있습니다.');
    return false;
  }
}

/**
 * 메인 실행 함수
 */
async function main() {
  console.log('🚀 캐시 워밍업 프로세스 시작\n');
  
  // 헬스체크 먼저 수행
  const isHealthy = await healthCheck();
  if (!isHealthy) {
    console.log('\n💀 서버 상태 불량으로 워밍업을 중단합니다.');
    process.exit(1);
  }
  
  console.log('');
  
  // 워밍업 실행
  const summary = await warmupAllPages();
  
  // 실패가 너무 많으면 exit code로 알림
  if (summary.failed > summary.total * 0.5) {
    console.log('\n⚠️ 실패한 페이지가 50% 이상입니다. 확인이 필요합니다.');
    process.exit(1);
  }
}

// 직접 실행 시에만 main() 호출
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('\n💥 워밍업 중 치명적 오류:', error.message);
    process.exit(1);
  });
}
