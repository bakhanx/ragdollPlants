'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin, ServerActionResult } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';
import { UserRole } from '@prisma/client';

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'inactive' | 'all';
  role?: UserRole | 'all';
  sort?: 'createdAt' | 'name' | 'lastActivityDate';
  order?: 'asc' | 'desc';
}

export async function getAdminUsers(params: UserListParams = {}) {
  try {
    await requireAdmin();

    const {
      page = 1,
      limit = 20,
      search = '',
      status = 'all',
      role = 'all',
      sort = 'createdAt',
      order = 'desc'
    } = params;

    const skip = (page - 1) * limit;

    // 검색 조건 구성
    const where: {
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' };
        email?: { contains: string; mode: 'insensitive' };
        loginId?: { contains: string; mode: 'insensitive' };
      }>;
      isActive?: boolean;
      role?: UserRole;
    } = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { loginId: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status !== 'all') {
      where.isActive = status === 'active';
    }

    if (role !== 'all') {
      where.role = role as UserRole;
    }

    // 정렬 조건
    const orderBy: { [key: string]: 'asc' | 'desc' } = {};
    orderBy[sort] = order;

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          loginId: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          lastActivityDate: true,
          image: true,
          level: true,
          experience: true,
          waterCount: true,
          nutrientCount: true,
          _count: {
            select: {
              plants: true,
              diaries: true,
              articles: true,
              galleries: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };
  } catch (error) {
    console.error('관리자 사용자 목록 조회 실패:', error);
    throw new Error('사용자 목록을 불러오는 중 오류가 발생했습니다.');
  }
}

export async function toggleUserStatus(
  userId: string,
  isActive: boolean
): Promise<ServerActionResult> {
  try {
    await requireAdmin();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, role: true }
    });

    if (!user) {
      return {
        success: false,
        error: '사용자를 찾을 수 없습니다.'
      };
    }

    // 관리자는 비활성화할 수 없음
    if (user.role === 'ADMIN' && !isActive) {
      return {
        success: false,
        error: '관리자 계정은 비활성화할 수 없습니다.'
      };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isActive }
    });

    revalidatePath('/admin/users');
    
    return {
      success: true,
      message: `${user.name}님의 계정이 ${isActive ? '활성화' : '비활성화'}되었습니다.`
    };
  } catch (error) {
    console.error('사용자 상태 변경 실패:', error);
    return {
      success: false,
      error: '사용자 상태를 변경하는 중 오류가 발생했습니다.'
    };
  }
}

export async function changeUserRole(
  userId: string,
  role: UserRole
): Promise<ServerActionResult> {
  try {
    await requireAdmin();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, role: true }
    });

    if (!user) {
      return {
        success: false,
        error: '사용자를 찾을 수 없습니다.'
      };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role }
    });

    revalidatePath('/admin/users');
    
    return {
      success: true,
      message: `${user.name}님의 권한이 ${role === 'ADMIN' ? '관리자' : '사용자'}로 변경되었습니다.`
    };
  } catch (error) {
    console.error('사용자 권한 변경 실패:', error);
    return {
      success: false,
      error: '사용자 권한을 변경하는 중 오류가 발생했습니다.'
    };
  }
}

export async function getUserDetail(userId: string) {
  try {
    await requireAdmin();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        plants: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            isActive: true
          }
        },
        articles: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            isActive: true,
            viewCount: true
          }
        },
        diaries: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            isActive: true
          }
        },
        galleries: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            isActive: true
          }
        },
        _count: {
          select: {
            plants: true,
            articles: true,
            diaries: true,
            galleries: true,
            likes: true,
            comments: true
          }
        }
      }
    });

    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    return user;
  } catch (error) {
    console.error('사용자 상세 조회 실패:', error);
    throw new Error('사용자 정보를 불러오는 중 오류가 발생했습니다.');
  }
}
