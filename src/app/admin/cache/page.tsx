'use client';

import { useState } from 'react';

interface WarmupResult {
  success: boolean;
  path: string;
  status?: number;
  duration: number;
  error?: string;
}

interface WarmupSummary {
  total: number;
  successful: number;
  failed: number;
  duration: number;
  averageDuration: number;
  results: WarmupResult[];
  timestamp: string;
}

export default function CacheManagementPage() {
  const [isWarming, setIsWarming] = useState(false);
  const [lastSummary, setLastSummary] = useState<WarmupSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startWarmup = async () => {
    if (isWarming) return;
    
    setIsWarming(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/cache-warmup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '워밍업 요청이 실패했습니다');
      }
      
      setLastSummary(data.summary);
      
    } catch (err) {
      console.error('캐시 워밍업 오류:', err);
      setError(err instanceof Error ? err.message : '워밍업 중 오류가 발생했습니다');
    } finally {
      setIsWarming(false);
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">캐시 관리</h1>
        <p className="text-gray-600">
          서버 캐시를 미리 생성하여 사용자 경험을 개선합니다.
        </p>
      </div>

      {/* 워밍업 실행 카드 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            🔥 캐시 워밍업 실행
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {/* 대상 페이지들 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">워밍업 대상 페이지들</h4>
              <div className="grid grid-cols-3 gap-2 text-sm text-blue-700">
                <span>/ (홈페이지)</span>
                <span>/login (로그인)</span>
                <span>/garden (프로필 목록)</span>
                <span>/myplants (내 식물)</span>
                <span>/diaries (다이어리)</span>
                <span>/galleries (갤러리)</span>
                <span>/care (케어 관리)</span>
                <span>/events (이벤트)</span>
                <span>/articles (아티클)</span>
              </div>
            </div>

            {/* 실행 버튼 */}
            <div className="flex items-center gap-4">
              <button
                onClick={startWarmup}
                disabled={isWarming}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isWarming
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isWarming ? (
                  <>
                    <svg 
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    워밍업 실행 중...
                  </>
                ) : (
                  '캐시 워밍업 시작'
                )}
              </button>
              
              {lastSummary && (
                <div className="text-sm text-gray-600">
                  마지막 워밍업: {formatTimestamp(lastSummary.timestamp)}
                </div>
              )}
            </div>

            {/* 오류 메시지 */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-1">오류 발생</h4>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 워밍업 결과 카드 */}
      {lastSummary && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              📊 마지막 워밍업 결과
            </h2>
          </div>
          <div className="p-6">
            {/* 요약 통계 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-700">
                  {lastSummary.successful}
                </div>
                <div className="text-sm text-green-600">성공</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-700">
                  {lastSummary.failed}
                </div>
                <div className="text-sm text-red-600">실패</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {formatDuration(lastSummary.duration)}
                </div>
                <div className="text-sm text-blue-600">총 소요시간</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-700">
                  {formatDuration(lastSummary.averageDuration)}
                </div>
                <div className="text-sm text-purple-600">평균 응답시간</div>
              </div>
            </div>

            {/* 페이지별 상세 결과 */}
            <div>
              <h4 className="font-medium mb-3">페이지별 상세 결과</h4>
              <div className="space-y-2">
                {lastSummary.results.map((result, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      result.success
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        result.success ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className="font-medium">{result.path}</span>
                      {result.status && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {result.status}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className={
                        result.success ? 'text-green-700' : 'text-red-700'
                      }>
                        {formatDuration(result.duration)}
                      </span>
                      {result.error && (
                        <span className="text-red-600 text-xs max-w-xs truncate">
                          {result.error}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 안내 정보 카드 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            ℹ️ 캐시 워밍업 안내
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-3 text-sm text-gray-600">
            <div>
              <strong>워밍업 목적:</strong> 주요 페이지의 서버 캐시(unstable_cache)를 미리 생성하여 
              사용자들이 빠른 로딩 속도를 경험할 수 있도록 합니다.
            </div>
            <div>
              <strong>실행 시점:</strong> 새로운 콘텐츠 대량 업로드 후, 서버 재시작 후, 
              또는 성능 최적화가 필요할 때 수동으로 실행하세요.
            </div>
            <div>
              <strong>자동 워밍업:</strong> 배포 완료 후에는 자동으로 캐시 워밍업이 실행됩니다.
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-4">
              <strong className="text-yellow-800">주의:</strong>
              <span className="text-yellow-700">
                {' '}워밍업은 서버 리소스를 사용하므로, 트래픽이 많은 시간대에는 피해주세요.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
