'use client';

import { useState } from 'react';
import { Button } from '@/app/_components/common/Button';

export default function DataRestore() {
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/json') {
      setSelectedFile(file);
      setRestoreStatus(null);
    } else {
      setRestoreStatus('❌ JSON 파일만 선택할 수 있습니다');
    }
  };

  const handleRestoreFromFile = async () => {
    if (!selectedFile) return;

    setIsRestoring(true);
    setRestoreStatus(null);
    setShowConfirm(false);

    try {
      const fileContent = await selectedFile.text();
      const backupData = JSON.parse(fileContent);

      const response = await fetch('/api/admin/restore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ backupData }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '복원 실패');
      }

      setRestoreStatus(`✅ 복원 완료: Events ${result.restored.events}개, Articles ${result.restored.articles}개`);
      setSelectedFile(null);
    } catch (error) {
      console.error('복원 오류:', error);
      setRestoreStatus('❌ 데이터 복원 중 오류가 발생했습니다');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleRestoreDefault = async () => {
    setIsRestoring(true);
    setRestoreStatus(null);
    setShowConfirm(false);

    try {
      const response = await fetch('/api/admin/restore', {
        method: 'POST',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '복원 실패');
      }

      setRestoreStatus(`✅ 복원 완료: Events ${result.restored.events}개, Articles ${result.restored.articles}개`);
    } catch (error) {
      console.error('복원 오류:', error);
      setRestoreStatus('❌ 데이터 복원 중 오류가 발생했습니다');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow border-l-4 border-green-500">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">데이터 복원</h2>
      
      <div className="space-y-6">
        {/* 파일 업로드 복원 */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-3">📂 백업 파일 업로드</h3>
          
          <div className="space-y-3">
            <input
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            
            {selectedFile && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-blue-700">✅ {selectedFile.name}</span>
                <Button 
                  onClick={handleRestoreFromFile}
                  disabled={isRestoring}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3"
                >
                  {isRestoring ? '복원 중...' : '복원하기'}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 기본 복원 */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-medium text-green-900 mb-2">📋 기본 백업 복원</h3>
          <p className="text-green-700 text-sm mb-3">
            backup-2025-07-04.json 파일의 Events와 Articles 데이터를 복원합니다.
          </p>

          <div className="flex items-center gap-2">
            {!showConfirm ? (
              <Button 
                onClick={() => setShowConfirm(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                📂 기본 데이터 복원
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleRestoreDefault}
                  disabled={isRestoring}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isRestoring ? '복원 중...' : '✅ 확인 - 복원 실행'}
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
        </div>

        {restoreStatus && (
          <div className={`p-3 rounded-lg text-sm ${
            restoreStatus.includes('✅') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {restoreStatus}
          </div>
        )}

        <div className="text-sm text-gray-500">
          <p>💡 복원은 기존 데이터에 추가하는 방식입니다 (덮어쓰지 않음).</p>
          <p>🔄 복원 전에 데이터베이스를 리셋하면 깔끔하게 시작할 수 있습니다.</p>
          <p>📊 복원 후 Events와 Articles 페이지에서 확인하세요.</p>
        </div>
      </div>
    </div>
  );
} 