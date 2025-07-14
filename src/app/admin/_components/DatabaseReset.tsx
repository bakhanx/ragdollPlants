'use client';

import { useState } from 'react';
import { Button } from '@/app/_components/common/Button';

export default function DatabaseReset() {
  const [isResetting, setIsResetting] = useState(false);
  const [resetStatus, setResetStatus] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    setResetStatus(null);
    setShowConfirm(false);

    try {
      const response = await fetch('/api/admin/reset-db', {
        method: 'POST',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '리셋 실패');
      }

      setResetStatus('✅ 데이터베이스가 성공적으로 리셋되었습니다');
      
      // 3초 후 페이지 새로고침
      setTimeout(() => {
        window.location.reload();
      }, 3000);

    } catch (error) {
      console.error('리셋 오류:', error);
      setResetStatus('❌ 데이터베이스 리셋 중 오류가 발생했습니다');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow border-l-4 border-red-500">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">데이터베이스 리셋</h2>
      
      <div className="space-y-4">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-red-800 font-medium">⚠️ 위험한 작업입니다!</p>
          <p className="text-red-700 text-sm mt-1">
            이 작업은 모든 데이터를 삭제하고 데이터베이스를 초기 상태로 되돌립니다.
          </p>
        </div>

        <p className="text-gray-600">
          데이터베이스를 완전히 리셋하고 새로운 스키마를 적용합니다.
        </p>

        <div className="flex items-center gap-4">
          {!showConfirm ? (
            <Button 
              onClick={() => setShowConfirm(true)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              🗑️ 데이터베이스 리셋
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleReset}
                disabled={isResetting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isResetting ? '리셋 중...' : '✅ 확인 - 리셋 실행'}
              </Button>
              <Button 
                onClick={() => setShowConfirm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                ❌ 취소
              </Button>
            </div>
          )}
        </div>

        {resetStatus && (
          <div className={`p-3 rounded-lg text-sm ${
            resetStatus.includes('✅') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {resetStatus}
            {resetStatus.includes('✅') && (
              <p className="mt-1 text-xs">페이지가 곧 새로고침됩니다...</p>
            )}
          </div>
        )}

        <div className="text-sm text-gray-500">
          <p>💡 리셋 전에 반드시 데이터를 백업해주세요.</p>
          <p>🔄 리셋 후 스키마 변경사항이 적용됩니다.</p>
        </div>
      </div>
    </div>
  );
} 