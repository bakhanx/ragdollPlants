import React from 'react';
import { createPortal } from 'react-dom';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  description?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = '잠시만 기다려주세요...',
  description
}) => {
  if (!isVisible) return null;

  if (typeof window === 'undefined') return null; // SSR 체크

  const overlayContent = (
    <div
      className="fixed inset-0 z-[50] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh'
      }}>
      <div className="rounded-lg bg-white px-8 py-6 shadow-xl">
        <div className="flex flex-col items-center space-y-4">
          {/* 스피너 */}
          <div className="relative">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-green-600"></div>
            <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border-4 border-green-200 opacity-20"></div>
          </div>

          {/* 메시지 */}
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800">{message}</p>
            {description && (
              <p className="mt-1 text-sm text-gray-600">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(overlayContent, document.body);
};
