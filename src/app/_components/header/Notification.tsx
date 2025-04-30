'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { notifications } from '@/app/_temp';

// 타입을 constants.ts에서 가져오도록 수정
import type { NotificationType } from '@/app/_temp';

interface NotificationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Notification = ({ isOpen, onClose }: NotificationProps) => {
  const router = useRouter();
  const [notifs, setNotifs] = React.useState<NotificationType[]>(notifications);
  
  if (!isOpen) return null;
  
  const handleNotificationClick = (notif: NotificationType) => {
    // 알림을 읽음 처리
    setNotifs(prev =>
      prev.map(n => (n.id === notif.id ? { ...n, isRead: true } : n))
    );
    
    // 알림 유형에 따라 다른 페이지로 이동
    if (notif.type === 'water' && notif.plantId) {
      router.push(`/water`);
    } else if (notif.type === 'nutrient' && notif.plantId) {
      router.push(`/nutrient`);
    } else if (notif.type === 'article' && notif.articleId) {
      router.push(`/articles/${notif.articleId}`);
    }
    
    onClose();
  };
  
  const unreadCount = notifs.filter(n => !n.isRead).length;
  
  return (
    <>
      {/* 오버레이 */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm rounded-xl"
        onClick={onClose}
      />
      
      {/* 알림 패널 */}
      <div className="fixed top-0 right-0 z-50 h-[60vh] w-72 transform bg-white shadow-xl transition-transform rounded-xl overflow-hidden">
        <div className="p-4 flex flex-col h-full">
          {/* 알림 헤더 */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800">알림</h2>
              {unreadCount > 0 && (
                <span className="text-sm text-gray-500">읽지 않은 알림 {unreadCount}개</span>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100"
              aria-label="알림 닫기">
              <svg
                className="h-5 w-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
          {/* 알림 목록 - 스크롤 가능한 영역 */}
          <div className="space-y-2 overflow-y-auto flex-1 pr-1">
            {notifs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                알림이 없습니다
              </div>
            ) : (
              notifs.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`cursor-pointer rounded-xl p-3 transition-all ${
                    notif.isRead ? 'bg-gray-50' : 'bg-blue-50'
                  } hover:bg-gray-100`}>
                  <div className="flex items-start gap-2">
                    {/* 아이콘 */}
                    <div className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${
                      notif.type === 'water' 
                        ? 'bg-blue-100 text-blue-500' 
                        : notif.type === 'nutrient' 
                        ? 'bg-green-100 text-green-500'
                        : 'bg-yellow-100 text-yellow-500'
                    }`}>
                      {notif.type === 'water' && (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                          />
                        </svg>
                      )}
                      {notif.type === 'nutrient' && (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      )}
                      {notif.type === 'article' && (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                          />
                        </svg>
                      )}
                    </div>
                    
                    {/* 콘텐츠 */}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{notif.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{notif.message}</p>
                      <p className="mt-1 text-xs text-gray-400">{notif.date}</p>
                    </div>
                    
                    {/* 읽지 않은 표시 */}
                    {!notif.isRead && (
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
} 