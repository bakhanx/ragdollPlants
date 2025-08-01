'use client';

import { useState } from 'react';
import { Button } from '@/app/_components/common/Button';

export default function DataUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<{
    articles: boolean;
    events: boolean;
  }>({
    articles: false,
    events: false
  });

  const handleUploadArticles = async () => {
    setIsUploading(true);
    setUploadStatus(null);
    setShowConfirm(prev => ({ ...prev, articles: false }));

    try {
      const response = await fetch('/api/admin/upload-articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '업로드 실패');
      }

      setUploadStatus(`✅ 아티클 업로드 완료: ${result.count}개`);
    } catch (error) {
      console.error('아티클 업로드 오류:', error);
      setUploadStatus('❌ 아티클 업로드 중 오류가 발생했습니다');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadEvents = async () => {
    setIsUploading(true);
    setUploadStatus(null);
    setShowConfirm(prev => ({ ...prev, events: false }));

    try {
      const response = await fetch('/api/admin/upload-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '업로드 실패');
      }

      setUploadStatus(`✅ 이벤트 업로드 완료: ${result.count}개`);
    } catch (error) {
      console.error('이벤트 업로드 오류:', error);
      setUploadStatus('❌ 이벤트 업로드 중 오류가 발생했습니다');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow border-l-4 border-blue-500">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">데이터 업로드</h2>
      
      <div className="space-y-6">
        {/* 아티클 업로드 */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-medium text-green-900 mb-2">📰 아티클 데이터 업로드</h3>
          <p className="text-green-700 text-sm mb-3">
            식물 관리 가이드 3개 아티클을 업로드합니다.
          </p>

          <div className="flex items-center gap-2">
            {!showConfirm.articles ? (
              <Button 
                onClick={() => setShowConfirm(prev => ({ ...prev, articles: true }))}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={isUploading}
              >
                📰 아티클 업로드
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleUploadArticles}
                  disabled={isUploading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isUploading ? '업로드 중...' : '✅ 확인 - 업로드 실행'}
                </Button>
                <Button 
                  onClick={() => setShowConfirm(prev => ({ ...prev, articles: false }))}
                  className="bg-gray-500 hover:bg-gray-600 text-white"
                  disabled={isUploading}
                >
                  ❌ 취소
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 이벤트 업로드 */}
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="font-medium text-purple-900 mb-2">🎉 이벤트 데이터 업로드</h3>
          <p className="text-purple-700 text-sm mb-3">
            eventData.ts의 이벤트 데이터를 데이터베이스에 업로드합니다.
          </p>

          <div className="flex items-center gap-2">
            {!showConfirm.events ? (
              <Button 
                onClick={() => setShowConfirm(prev => ({ ...prev, events: true }))}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isUploading}
              >
                🎉 이벤트 업로드
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleUploadEvents}
                  disabled={isUploading}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isUploading ? '업로드 중...' : '✅ 확인 - 업로드 실행'}
                </Button>
                <Button 
                  onClick={() => setShowConfirm(prev => ({ ...prev, events: false }))}
                  className="bg-gray-500 hover:bg-gray-600 text-white"
                  disabled={isUploading}
                >
                  ❌ 취소
                </Button>
              </div>
            )}
          </div>
        </div>

        {uploadStatus && (
          <div className={`p-3 rounded-lg text-sm ${
            uploadStatus.includes('✅') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {uploadStatus}
          </div>
        )}

        <div className="text-sm text-gray-500">
          <p>💡 업로드는 기존 데이터에 추가하는 방식입니다.</p>
          <p>🔄 중복 데이터는 자동으로 필터링됩니다.</p>
          <p>📊 업로드 후 해당 페이지에서 확인하세요.</p>
        </div>
      </div>
    </div>
  );
}