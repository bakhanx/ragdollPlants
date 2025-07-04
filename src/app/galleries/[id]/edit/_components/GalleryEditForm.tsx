'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getUserGalleries, updateGallery, deleteGallery, setFeaturedGallery, updateGalleriesOrder } from '@/app/actions/galleries';
import type { GalleryItem } from '@/app/galleries/_components/GalleryGrid';

interface GalleryEditFormProps {
  galleryId: string;
}

export const GalleryEditForm = ({ galleryId }: GalleryEditFormProps) => {
  const router = useRouter();
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
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
      setGalleries(data);
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
      [newGalleries[index], newGalleries[index - 1]] = [newGalleries[index - 1], newGalleries[index]];
      setGalleries(newGalleries);
    }
  };

  // 순서 변경 (아래로)
  const moveDown = (index: number) => {
    if (index < galleries.length - 1) {
      const newGalleries = [...galleries];
      [newGalleries[index], newGalleries[index + 1]] = [newGalleries[index + 1], newGalleries[index]];
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
  const startEditing = (item: GalleryItem) => {
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
            ? { ...item, title: editData.title, description: editData.description }
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
    if (!confirm(`선택된 ${selectedItems.size}개의 갤러리를 삭제하시겠습니까?`)) return;

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
      <div className="flex items-center justify-center min-h-64 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>갤러리를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (galleries.length === 0) {
    return (
      <div className="text-center text-white py-12">
        <p className="text-lg mb-4">편집할 갤러리가 없습니다.</p>
        <button
          onClick={() => router.push('/galleries')}
          className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg transition-colors"
        >
          갤러리로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 text-white">
      {/* 헤더 액션 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold mb-2">갤러리 관리</h2>
          <p className="text-sm text-white/70">버튼으로 순서를 변경하고, 대표 작품을 설정하세요.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {selectedItems.size > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={isSubmitting}
              className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 px-4 py-2 rounded-lg text-red-400 font-medium transition-colors disabled:opacity-50"
            >
              선택 삭제 ({selectedItems.size})
            </button>
          )}
          
          <button
            onClick={toggleSelectAll}
            className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {selectedItems.size === galleries.length ? '전체 해제' : '전체 선택'}
          </button>
          
          <button
            onClick={saveOrder}
            disabled={isSubmitting}
            className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 px-4 py-2 rounded-lg text-blue-400 font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting ? '저장 중...' : '순서 저장'}
          </button>
        </div>
      </div>

      {/* 갤러리 목록 */}
      <div className="space-y-4">
        {galleries.map((item, index) => (
          <div
            key={item.id}
            className="bg-black/30 border border-white/20 rounded-lg p-4"
          >
            <div className="flex gap-4">
              {/* 순서 변경 버튼 */}
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="p-1 bg-white/10 hover:bg-white/20 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="위로 이동"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <span className="text-xs text-center text-white/60">{index + 1}</span>
                <button
                  onClick={() => moveDown(index)}
                  disabled={index === galleries.length - 1}
                  className="p-1 bg-white/10 hover:bg-white/20 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="아래로 이동"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* 체크박스 */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedItems.has(item.id)}
                  onChange={() => toggleSelectItem(item.id)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              {/* 이미지 */}
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-black/20">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                {index === 0 && (
                  <div className="absolute top-1 right-1 bg-yellow-500 text-black text-xs px-1 rounded">
                    대표
                  </div>
                )}
              </div>

              {/* 내용 */}
              <div className="flex-1 min-w-0">
                {editingItem === item.id ? (
                  // 편집 모드
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editData.title}
                      onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:border-white/40"
                      placeholder="제목을 입력하세요"
                    />
                    <textarea
                      value={editData.description}
                      onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:border-white/40 resize-none"
                      placeholder="설명을 입력하세요"
                      rows={2}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => saveEdit(item.id)}
                        disabled={isSubmitting}
                        className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 px-3 py-1 rounded text-green-400 text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        저장
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={isSubmitting}
                        className="bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/50 px-3 py-1 rounded text-gray-400 text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  // 일반 모드
                  <>
                    <h3 className="font-semibold text-lg mb-1 truncate">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-white/70 mb-2 line-clamp-2">{item.description}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-white/50">
                      <span>
                        {item.createdAt instanceof Date 
                          ? item.createdAt.toLocaleDateString('ko-KR')
                          : new Date(item.createdAt).toLocaleDateString('ko-KR')}
                      </span>
                      <span>❤️ {item.likes}</span>
                    </div>
                  </>
                )}
              </div>

              {/* 액션 버튼들 */}
              {editingItem !== item.id && (
                <div className="flex flex-col space-y-2">
                  {index !== 0 && (
                    <button
                      onClick={() => handleSetFeatured(item.id)}
                      className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded text-yellow-400 transition-colors"
                      title="대표 작품으로 설정"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </button>
                  )}
                  
                  <button
                    onClick={() => startEditing(item)}
                    className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-400 transition-colors"
                    title="편집"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded text-red-400 transition-colors"
                    title="삭제"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 하단 액션 */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => router.push('/galleries')}
          className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          갤러리로 돌아가기
        </button>
      </div>
    </div>
  );
}; 