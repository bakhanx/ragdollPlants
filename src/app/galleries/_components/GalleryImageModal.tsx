'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import {
  updateGallery,
  deleteGallery,
  setFeaturedGallery
} from '@/app/actions/galleries';
import { formatDateTime } from '@/app/_utils/dateUtils';
import type { CachedGallery } from '@/types/cache/gallery';

interface GalleryImageModalProps {
  item: CachedGallery;
  children: React.ReactNode;
  isOwner?: boolean;
  onUpdate?: (updatedItem: CachedGallery) => void;
  onDelete?: (deletedId: string) => void;
  onSetFeatured?: (itemId: string) => void;
}

export const GalleryImageModal = ({
  item,
  children,
  isOwner = false,
  onUpdate,
  onDelete,
  onSetFeatured
}: GalleryImageModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editData, setEditData] = useState({
    title: item.title,
    description: item.description || ''
  });

  // 클라이언트에서만 렌더링되도록 보장
  useEffect(() => {
    setMounted(true);
  }, []);

  // 이미지가 캐시되어 있는지 확인
  const checkImageCache = useCallback(() => {
    if (typeof window === 'undefined') return false;

    const img = document.createElement('img');
    img.src = item.image;

    // 이미지가 이미 캐시되어 있으면 complete가 true가 됨
    if (img.complete && img.naturalWidth > 0) {
      setImageLoaded(true);
      return true;
    }

    return false;
  }, [item.image]);

  // 모달이 열릴 때마다 상태 초기화 및 캐시 확인
  useEffect(() => {
    if (isOpen) {
      // 캐시 확인
      const isCached = checkImageCache();
      if (!isCached) {
        setImageLoaded(false);
      }
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setEditMode(false);
    }
  }, [isOpen, item.image, checkImageCache]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (editMode) {
          setEditMode(false);
        } else {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, editMode]);

  const handleImageClick = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleEdit = () => {
    setEditData({
      title: item.title,
      description: item.description || ''
    });
    setEditMode(true);
  };

  const handleSave = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', editData.title);
      formData.append('description', editData.description);

      await updateGallery(item.id, formData);

      // 부모 컴포넌트에 업데이트 알림
      if (onUpdate) {
        onUpdate({
          ...item,
          title: editData.title,
          description: editData.description
        });
      }

      setEditMode(false);
      alert('갤러리가 수정되었습니다.');
    } catch (error) {
      console.error('갤러리 수정 오류:', error);
      alert('갤러리 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말로 이 갤러리를 삭제하시겠습니까?')) return;

    setIsSubmitting(true);
    try {
      await deleteGallery(item.id);

      // 부모 컴포넌트에 삭제 알림
      if (onDelete) {
        onDelete(item.id);
      }

      closeModal();
      alert('갤러리가 삭제되었습니다.');
    } catch (error) {
      console.error('갤러리 삭제 오류:', error);
      alert('갤러리 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetFeatured = async () => {
    if (!confirm('이 이미지를 대표 작품으로 설정하시겠습니까?')) return;

    setIsSubmitting(true);
    try {
      await setFeaturedGallery(item.id);

      if (onSetFeatured) {
        onSetFeatured(item.id);
      }

      alert('대표 작품으로 설정되었습니다.');
    } catch (error) {
      console.error('대표 이미지 설정 오류:', error);
      alert('대표 이미지 설정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditData({
      title: item.title,
      description: item.description || ''
    });
  };

  // 서버 사이드에서는 모달을 렌더링하지 않음
  if (!mounted) {
    return <div onClick={handleImageClick}>{children}</div>;
  }

  // 고정 모달 크기
  const modalWidth = Math.min(window.innerWidth * 0.9, 1200);
  const modalHeight = Math.min(window.innerHeight * 0.9, 800);

  return (
    <>
      <div onClick={handleImageClick}>{children}</div>

      {/* Portal을 사용해 body에 모달 렌더링 */}
      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-10 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={closeModal}>
            {/* 이미지 컨테이너 - 고정 크기 */}
            <div
              className="relative overflow-hidden rounded-lg shadow-2xl"
              style={{
                width: modalWidth,
                height: modalHeight
              }}
              onClick={e => e.stopPropagation()}>
              {/* 닫기 버튼 - 이미지 내부 우측상단 */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-20 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* 편집 버튼들 - 소유자만 */}
              {isOwner && !editMode && (
                <div className="absolute top-4 left-4 z-20 flex space-x-2">
                  <button
                    onClick={handleEdit}
                    className="rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={handleSetFeatured}
                    className="rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </button>
                  <Link
                    href={`/galleries/${item.id}/edit`}
                    className="rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="rounded-full bg-red-500/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-red-500/30">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              )}

              {/* 스켈레톤 이미지 - 캐시되지 않은 경우만 표시 */}
              {!imageLoaded && (
                <div
                  className="absolute inset-0 animate-pulse bg-black/60"
                  style={{
                    width: modalWidth,
                    height: modalHeight
                  }}
                />
              )}

              {/* 실제 이미지 */}
              <Image
                src={`${item.image}/public`}
                alt={item.title}
                fill
                className={`bg-black/60 object-contain transition-opacity duration-500 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={handleImageLoad}
                priority
              />

              {/* 이미지 정보 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent">
                <div className="absolute bottom-0 w-full p-4 text-white md:p-6">
                  {editMode ? (
                    // 편집 모드
                    <div className="space-y-4">
                      <div>
                        <input
                          type="text"
                          value={editData.title}
                          onChange={e =>
                            setEditData(prev => ({
                              ...prev,
                              title: e.target.value
                            }))
                          }
                          className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-white placeholder-white/60 focus:border-white/40 focus:outline-none"
                          placeholder="제목을 입력하세요"
                        />
                      </div>
                      <div>
                        <textarea
                          value={editData.description}
                          onChange={e =>
                            setEditData(prev => ({
                              ...prev,
                              description: e.target.value
                            }))
                          }
                          className="w-full resize-none rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-white placeholder-white/60 focus:border-white/40 focus:outline-none"
                          placeholder="설명을 입력하세요"
                          rows={3}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSave}
                          disabled={isSubmitting}
                          className="flex-1 rounded-lg border border-green-500/50 bg-green-500/20 px-4 py-2 font-medium text-green-400 transition-colors hover:bg-green-500/30 disabled:opacity-50">
                          {isSubmitting ? '저장 중...' : '저장'}
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={isSubmitting}
                          className="flex-1 rounded-lg border border-gray-500/50 bg-gray-500/20 px-4 py-2 font-medium text-gray-400 transition-colors hover:bg-gray-500/30 disabled:opacity-50">
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    // 일반 모드
                    <>
                      <h3 className="mb-2 text-lg leading-tight font-bold break-words md:text-xl">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm">
                        <span className="opacity-90">
                          {formatDateTime(item.createdAt)}
                        </span>
                        <div className="flex items-center space-x-1">
                          <span>❤️</span>
                          <span className="font-medium">{item.likes}</span>
                        </div>
                      </div>
                      {item.description && (
                        <p className="mt-2 text-sm leading-relaxed break-words opacity-90">
                          {item.description}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
