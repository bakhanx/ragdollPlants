'use client';

import { useState } from 'react';
import { Button } from '@/app/_components/common/Button';

export default function DataBackup() {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupStatus, setBackupStatus] = useState<string | null>(null);

  const handleBackup = async () => {
    setIsBackingUp(true);
    setBackupStatus(null);

    try {
      const response = await fetch('/api/admin/backup', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('백업 실패');
      }

      // JSON 데이터를 받아서 파일로 다운로드
      const backupData = await response.json();
      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: 'application/json',
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setBackupStatus(`✅ 백업 완료: Events ${backupData.summary.eventsCount}개, Articles ${backupData.summary.articlesCount}개`);
    } catch (error) {
      console.error('백업 오류:', error);
      setBackupStatus('❌ 백업 중 오류가 발생했습니다');
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">데이터 백업</h2>
      
      <div className="space-y-4">
        <p className="text-gray-600">
          현재 데이터베이스의 Events와 Articles 데이터를 JSON 파일로 백업합니다.
        </p>

        <div className="flex items-center gap-4">
          <Button 
            onClick={handleBackup}
            disabled={isBackingUp}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isBackingUp ? '백업 중...' : '📥 데이터 백업'}
          </Button>
        </div>

        {backupStatus && (
          <div className={`p-3 rounded-lg text-sm ${
            backupStatus.includes('✅') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {backupStatus}
          </div>
        )}

        <div className="text-sm text-gray-500">
          <p>💡 백업 파일은 브라우저 다운로드 폴더에 저장됩니다.</p>
          <p>📅 파일명: backup-{new Date().toISOString().split('T')[0]}.json</p>
        </div>
      </div>
    </div>
  );
} 