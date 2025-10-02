'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  getUserGalleries,
  updateGallery,
  deleteGallery,
  setFeaturedGallery,
  updateGalleriesOrder
} from '@/app/actions/galleries';
import type { CachedGallery } from '@/types/cache/gallery';
import { formatDateKorean } from '@/app/_utils/dateUtils';

interface GalleryEditFormProps {
  galleryId: string;
}

export const GalleryEditForm = ({ galleryId }: GalleryEditFormProps) => {
  const router = useRouter();
  const [galleries, setGalleries] = useState<CachedGallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editData, setEditData] = useState({ title: '', description: '' });

  // 갤러리 목록 로드
  useEffect(() => {
    loadGalleries();
  }, []);

  const loadGalleries = async () => {
    try {
      setIsLoading(true);
      const data = await getUserGalleries();
      setGalleries(data.galleries);
    } catch (error) {
      console.error('갤러리 목록 로드 오류:', error);
      alert('갤러리 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 순서 변경 (위로)
  const moveUp = (index: number) => {
    if (index > 0) {
      const newGalleries = [...galleries];
      [newGalleries[index], newGalleries[index - 1]] = [
        newGalleries[index - 1],
        newGalleries[index]
      ];
      setGalleries(newGalleries);
    }
  };

  // 순서 변경 (아래로)
  const moveDown = (index: number) => {
    if (index < galleries.length - 1) {
      const newGalleries = [...galleries];
      [newGalleries[index], newGalleries[index + 1]] = [
        newGalleries[index + 1],
        newGalleries[index]
      ];
      setGalleries(newGalleries);
    }
  };

  // 대표 이미지 설정 (맨 앞으로 이동)
  const handleSetFeatured = async (itemId: string) => {
    if (!confirm('이 이미지를 대표 작품으로 설정하시겠습니까?')) return;

    setIsSubmitting(true);
    try {
      await setFeaturedGallery(itemId);

      // 로컬 상태도 업데이트 (UI 즉시 반영)
      const newGalleries = [...galleries];
      const targetIndex = newGalleries.findIndex(item => item.id === itemId);

      if (targetIndex > 0) {
        const [featuredItem] = newGalleries.splice(targetIndex, 1);
        newGalleries.unshift(featuredItem);
        setGalleries(newGalleries);
      }

      alert('대표 작품으로 설정되었습니다.');
    } catch (error) {
      console.error('대표 이미지 설정 오류:', error);
      alert('대표 이미지 설정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 개별 편집 시작
  const startEditing = (item: CachedGallery) => {
    setEditingItem(item.id);
    setEditData({
      title: item.title,
      description: item.description || ''
    });
  };

  // 개별 편집 저장
  const saveEdit = async (itemId: string) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', editData.title);
      formData.append('description', editData.description);

      await updateGallery(itemId, formData);

      // 로컬 상태 업데이트
      setGalleries(prev =>
        prev.map(item =>
          item.id === itemId
            ? {
                ...item,
                title: editData.title,
                description: editData.description
              }
            : item
        )
      );

      setEditingItem(null);
      alert('갤러리가 수정되었습니다.');
    } catch (error) {
      console.error('갤러리 수정 오류:', error);
      alert('갤러리 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 개별 편집 취소
  const cancelEdit = () => {
    setEditingItem(null);
    setEditData({ title: '', description: '' });
  };

  // 개별 삭제
  const handleDelete = async (itemId: string) => {
    if (!confirm('정말로 이 갤러리를 삭제하시겠습니까?')) return;

    setIsSubmitting(true);
    try {
      await deleteGallery(itemId);
      setGalleries(prev => prev.filter(item => item.id !== itemId));
      alert('갤러리가 삭제되었습니다.');
    } catch (error) {
      console.error('갤러리 삭제 오류:', error);
      alert('갤러리 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 일괄 선택/해제
  const toggleSelectAll = () => {
    if (selectedItems.size === galleries.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(galleries.map(item => item.id)));
    }
  };

  // 개별 선택/해제
  const toggleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  // 일괄 삭제
  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return;
    if (!confirm(`선택된 ${selectedItems.size}개의 갤러리를 삭제하시겠습니까?`))
      return;

    setIsSubmitting(true);
    try {
      await Promise.all(
        Array.from(selectedItems).map(itemId => deleteGallery(itemId))
      );

      setGalleries(prev => prev.filter(item => !selectedItems.has(item.id)));
      setSelectedItems(new Set());
      alert('선택된 갤러리들이 삭제되었습니다.');
    } catch (error) {
      console.error('일괄 삭제 오류:', error);
      alert('일괄 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 순서 저장
  const saveOrder = async () => {
    setIsSubmitting(true);
    try {
      // 갤러리 순서 데이터 준비
      const galleryOrder = galleries.map((gallery, index) => ({
        id: gallery.id,
        order: index
      }));

      await updateGalleriesOrder(galleryOrder);

      alert('순서가 저장되었습니다.');
      router.push('/galleries');
    } catch (error) {
      console.error('순서 저장 오류:', error);
      alert('순서 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-white"></div>
          <p>갤러리를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (galleries.length === 0) {
    return (
      <div className="py-12 text-center text-white">
        <p className="mb-4 text-lg">편집할 갤러리가 없습니다.</p>
        <button
          onClick={() => router.push('/galleries')}
          className="rounded-lg bg-white/20 px-6 py-2 transition-colors hover:bg-white/30">
          갤러리로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto py-6 text-white">
      {/* 헤더 액션 */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4">
        <div>
          <h2 className="mb-2 text-xl font-bold">갤러리 관리</h2>
          <p className="text-sm text-white/70">
            버튼으로 순서를 변경하고, 대표 작품을 설정하세요.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={toggleSelectAll}
            className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 font-medium transition-colors hover:bg-white/20">
            {selectedItems.size === galleries.length
              ? '전체 해제'
              : '전체 선택'}
          </button>

        
          <button
            onClick={saveOrder}
            disabled={isSubmitting}
            className="rounded-lg border border-blue-500/50 bg-blue-500/20 px-4 py-2 font-medium text-blue-400 transition-colors hover:bg-blue-500/30 disabled:opacity-50">
            {isSubmitting ? '저장 중...' : '순서 저장'}
          </button>

            {selectedItems.size > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={isSubmitting}
              className="rounded-lg border border-red-500/50 bg-red-500/20 px-4 py-2 font-medium text-red-400 transition-colors hover:bg-red-500/30 disabled:opacity-50">
              선택 삭제 ({selectedItems.size})
            </button>
          )}
        </div>
      </div>

      {/* 갤러리 목록 */}
      <div className="space-y-4">
        {galleries.map((item, index) => (
          <div
            key={item.id}
            className="rounded-lg border border-white/20 bg-black/30 sm:p-4 p-2">
            <div className="flex sm:gap-4 gap-3">
              {/* 순서 변경 버튼 */}
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="rounded bg-white/10 p-1 transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30"
                  title="위로 이동">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>
                <span className="text-center text-xs text-white/60">
                  {index + 1}
                </span>
                <button
                  onClick={() => moveDown(index)}
                  disabled={index === galleries.length - 1}
                  className="rounded bg-white/10 p-1 transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30"
                  title="아래로 이동">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              {/* 체크박스 */}
              <div className="flex items-start pt-1">
                <input
                  type="checkbox"
                  checked={selectedItems.has(item.id)}
                  onChange={() => toggleSelectItem(item.id)}
                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
                />
              </div>

              {/* 이미지 */}
              <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-black/20">
                <Image
                  src={`${item.image}/small`}
                  alt={item.title}
                  width={80}
                  height={80}
                  className="object-cover"
                  priority
                  unoptimized
                />
                {index === 0 && (
                  <div className="absolute top-1 right-1 rounded bg-yellow-500 px-1 text-xs text-black">
                    대표
                  </div>
                )}
              </div>

              {/* 내용 */}
              <div className="min-w-0 flex-1">
                {editingItem === item.id ? (
                  // 편집 모드
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editData.title}
                      onChange={e =>
                        setEditData(prev => ({
                          ...prev,
                          title: e.target.value
                        }))
                      }
                      maxLength={20}
                      className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-white placeholder-white/60 focus:border-white/40 focus:outline-none"
                      placeholder="제목을 입력하세요 (최대 20자)"
                    />
                    <textarea
                      value={editData.description}
                      onChange={e =>
                        setEditData(prev => ({
                          ...prev,
                          description: e.target.value
                        }))
                      }
                      maxLength={40}
                      className="w-full resize-none rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-white placeholder-white/60 focus:border-white/40 focus:outline-none"
                      placeholder="설명을 입력하세요 (최대 40자)"
                      rows={2}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => saveEdit(item.id)}
                        disabled={isSubmitting}
                        className="rounded border border-green-500/50 bg-green-500/20 px-3 py-1 text-sm font-medium text-green-400 transition-colors hover:bg-green-500/30 disabled:opacity-50">
                        저장
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={isSubmitting}
                        className="rounded border border-gray-500/50 bg-gray-500/20 px-3 py-1 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-500/30 disabled:opacity-50">
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  // 일반 모드
                  <>
                    <h3 className="mb-1 truncate text-lg font-semibold">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="mb-2 line-clamp-2 text-sm text-white/70">
                        {item.description}
                      </p>
                    )}
                    <div className="mb-1 flex items-center justify-between text-xs text-white/50">
                      <span>{formatDateKorean(item.createdAt)}</span>
                     
                    </div>
                    <div className='text-xs text-white/50'> ❤️ {item.likes}</div>
                  </>
                )}
              </div>

              {/* 액션 버튼들 */}
              {editingItem !== item.id && (
                <div className="flex flex-col space-y-2">
                  {index !== 0 && (
                    <button
                      onClick={() => handleSetFeatured(item.id)}
                      className="rounded bg-yellow-500/20 p-2 text-yellow-400 transition-colors hover:bg-yellow-500/30"
                      title="대표 작품으로 설정">
                      <svg
                        className="h-4 w-4"
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
                  )}

                  <button
                    onClick={() => startEditing(item)}
                    className="rounded bg-blue-500/20 p-2 text-blue-400 transition-colors hover:bg-blue-500/30"
                    title="편집">
                    <svg
                      className="h-4 w-4"
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
                    onClick={() => handleDelete(item.id)}
                    className="rounded bg-red-500/20 p-2 text-red-400 transition-colors hover:bg-red-500/30"
                    title="삭제">
                    <svg
                      className="h-4 w-4"
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
            </div>
          </div>
        ))}
      </div>

      {/* 하단 액션 */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => router.push('/galleries')}
          className="rounded-lg border border-white/20 bg-white/10 px-6 py-3 font-medium transition-colors hover:bg-white/20">
          갤러리로 돌아가기
        </button>
      </div>
    </div>
  );
};
