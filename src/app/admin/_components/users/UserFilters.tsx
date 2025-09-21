'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

export default function UserFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'createdAt');
  const [sortOrder, setSortOrder] = useState(searchParams.get('order') || 'desc');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters();
  };

  const updateFilters = () => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.set('search', searchTerm);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (roleFilter !== 'all') params.set('role', roleFilter);
    if (sortBy !== 'createdAt') params.set('sort', sortBy);
    if (sortOrder !== 'desc') params.set('order', sortOrder);

    router.push(`/admin/users?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setRoleFilter('all');
    setSortBy('createdAt');
    setSortOrder('desc');
    router.push('/admin/users');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        {/* 검색 */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="사용자 이름, 이메일 검색..."
            />
          </div>
        </form>

        {/* 필터 */}
        <div className="flex items-center space-x-4">
          {/* 상태 필터 */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">전체 상태</option>
            <option value="active">활성</option>
            <option value="inactive">비활성</option>
          </select>

          {/* 역할 필터 */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">전체 역할</option>
            <option value="USER">사용자</option>
            <option value="ADMIN">관리자</option>
          </select>

          {/* 정렬 */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [sort, order] = e.target.value.split('-');
              setSortBy(sort);
              setSortOrder(order);
            }}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="createdAt-desc">최신 가입순</option>
            <option value="createdAt-asc">오래된 가입순</option>
            <option value="name-asc">이름 오름차순</option>
            <option value="name-desc">이름 내림차순</option>
            <option value="lastActivityDate-desc">최근 활동순</option>
          </select>

          {/* 필터 적용/초기화 */}
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={updateFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FunnelIcon className="h-4 w-4 mr-1" />
              적용
            </button>
            
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              초기화
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
