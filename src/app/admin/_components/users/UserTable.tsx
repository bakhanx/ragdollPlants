'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatRelativeTime } from '@/app/_utils/dateUtils';
import { toggleUserStatus, changeUserRole } from '@/app/actions/admin-users';
import {
  UserCircleIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';

// getAdminUsers에서 반환 타입
type User = {
  id: string;
  loginId: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  lastActivityDate: Date | null;
  image: string | null;
  level: number;
  experience: number;
  waterCount: number;
  nutrientCount: number;
  _count: {
    plants: number;
    diaries: number;
    articles: number;
    galleries: number;
  };
};

interface UserTableProps {
  users: User[];
}

export default function UserTable({ users }: UserTableProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    setLoading(userId);
    try {
      const result = await toggleUserStatus(userId, !isActive);
      if (result.success) {
        // optimistic update 상태 관리 가능
        window.location.reload();
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('상태 변경 중 오류가 발생했습니다.');
    } finally {
      setLoading(null);
    }
  };

  const handleChangeRole = async (userId: string, role: string) => {
    setLoading(userId);
    try {
      const newRole = role === 'USER' ? 'ADMIN' : 'USER';
      const result = await changeUserRole(userId, newRole);
      if (result.success) {
        window.location.reload();
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('권한 변경 중 오류가 발생했습니다.');
    } finally {
      setLoading(null);
    }
  };

  if (users.length === 0) {
    return (
      <div className="py-12 text-center">
        <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">사용자 없음</h3>
        <p className="mt-1 text-sm text-gray-500">
          검색 조건에 맞는 사용자가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              사용자
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              레벨 & 활동
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              콘텐츠
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              가입일
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              상태
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
              작업
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {users.map(user => (
            <tr
              key={user.id}
              className="hover:bg-gray-50">
              {/* 사용자 정보 */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    {user.image ? (
                      <Image
                        className="h-10 w-10 rounded-full object-cover"
                        src={user.image}
                        alt={user.name}
                        width={40}
                        height={40}
                      />
                    ) : (
                      <UserCircleIcon className="h-10 w-10 text-gray-400" />
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-blue-600">
                        {user.name}
                      </Link>
                      {user.role === 'ADMIN' && (
                        <ShieldCheckIcon className="ml-2 h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    <div className="text-xs text-gray-400">@{user.loginId}</div>
                  </div>
                </div>
              </td>

              {/* 레벨 & 활동 */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  레벨 {user.level} ({user.experience.toLocaleString()} XP)
                </div>
                <div className="text-sm text-gray-500">
                  물주기 {user.waterCount}회 | 영양제 {user.nutrientCount}회
                </div>
                {user.lastActivityDate && (
                  <div className="text-xs text-gray-400">
                    최근 활동: {formatRelativeTime(user.lastActivityDate)}
                  </div>
                )}
              </td>

              {/* 콘텐츠 */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  식물 {user._count.plants}개 | 다이어리 {user._count.diaries}개
                </div>
                <div className="text-sm text-gray-500">
                  갤러리 {user._count.galleries}개 | 아티클{' '}
                  {user._count.articles}개
                </div>
              </td>

              {/* 가입일 */}
              <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                {formatRelativeTime(user.createdAt)}
              </td>

              {/* 상태 */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col space-y-1">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      user.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                    {user.isActive ? '활성' : '비활성'}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      user.role === 'ADMIN'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                    {user.role === 'ADMIN' ? '관리자' : '사용자'}
                  </span>
                </div>
              </td>

              {/* 작업 */}
              <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                <div className="relative inline-block text-left">
                  <button
                    onClick={() =>
                      setDropdownOpen(dropdownOpen === user.id ? null : user.id)
                    }
                    className="inline-flex items-center rounded-md p-2 text-gray-400 hover:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                    disabled={loading === user.id}>
                    <EllipsisVerticalIcon className="h-5 w-5" />
                  </button>

                  {dropdownOpen === user.id && (
                    <div className="ring-opacity-5 absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black">
                      <div className="py-1">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          상세 정보
                        </Link>

                        <button
                          onClick={() =>
                            handleToggleStatus(user.id, user.isActive)
                          }
                          className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                          disabled={
                            loading === user.id || user.role === 'ADMIN'
                          }>
                          {user.isActive ? '계정 비활성화' : '계정 활성화'}
                        </button>

                        {user.role !== 'ADMIN' && (
                          <button
                            onClick={() => handleChangeRole(user.id, user.role)}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                            disabled={loading === user.id}>
                            관리자로 승격
                          </button>
                        )}

                        {user.role === 'ADMIN' && (
                          <button
                            onClick={() => handleChangeRole(user.id, user.role)}
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                            disabled={loading === user.id}>
                            일반 사용자로 변경
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
